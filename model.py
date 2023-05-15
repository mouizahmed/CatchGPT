import re
import torch
import nltk
nltk.download('punkt')
import numpy as np
from transformers import GPT2LMHeadModel, GPT2TokenizerFast
from collections import Counter
from tqdm import tqdm

from nltk.tokenize import sent_tokenize
# print(torch.cuda.is_available())
# print(torch.zeros(1).cuda())


class model:

    
    def __init__(self):
        self.device = "cpu"
        self.model_id = "gpt2"
        self.model = GPT2LMHeadModel.from_pretrained(self.model_id).to(self.device)
        self.tokenizer = GPT2TokenizerFast.from_pretrained(self.model_id)
        self.max_length = self.model.config.n_positions
        self.stride = 512

    def __call__(self, text):
    
        lines = sent_tokenize(text)
        allInfo = []
        perplexity_per_line = []

        for i, line in enumerate(lines):
            ppl_object = dict()
            ppl_object["line"] = line
            pps = self.getPerplexityPerLine(line).item()
            ppl_object["ppl"] = pps
            ppl_object["length"] = len(line.split())
            allInfo.append(ppl_object)
            perplexity_per_line.append(pps)

        data = np.array(perplexity_per_line)
        #print(data)
        burstiness = np.std(data)
        #avgPP = sum(perplexity_per_line) / len(perplexity_per_line)
        avgPP = torch.mean(torch.tensor(perplexity_per_line)).item()
        output = dict()
        output['avgPP'] = avgPP
        output['avgLength'] = sum(item['length'] for item in allInfo ) / len(allInfo)
        senLengths = np.array(list(item['length'] for item in allInfo))
        
        output['lengthVariation'] = np.std(senLengths)
        output['burstiness'] = burstiness
        output['PPL'] = perplexity_per_line
        output['lines'] = lines
        output['maxPPL'] = int(max(perplexity_per_line))
        output['maxPPL_index'] = perplexity_per_line.index(
            max(perplexity_per_line))
        output['maxPPL_line'] = lines[output['maxPPL_index']]
        output['allInfo'] = allInfo
        return output
    
    def getPerplexityPerLine(self, line):
        encodings = self.tokenizer(line, return_tensors="pt")
        seq_len = encodings.input_ids.size(1)

        nlls = []
        prev_end_loc = 0
        for begin_loc in tqdm(range(0, seq_len, self.stride)):
            end_loc = min(begin_loc + self.max_length, seq_len)
            trg_len = end_loc - prev_end_loc  # may be different from stride on last loop
            input_ids = encodings.input_ids[:,
                                            begin_loc:end_loc].to(self.device)
            target_ids = input_ids.clone()
            target_ids[:, :-trg_len] = -100

            with torch.no_grad():
                outputs = self.model(input_ids, labels=target_ids)
                #print(outputs)
                # loss is calculated using CrossEntropyLoss which averages over input tokens.
                # Multiply it with trg_len to get the summation instead of average.
                # We will take average over all the tokens to get the true average
                # in the last step of this example.
                neg_log_likelihood = outputs.loss * trg_len

            nlls.append(neg_log_likelihood)

            prev_end_loc = end_loc
            if end_loc == seq_len:
                break

        ppl = torch.exp(torch.stack(nlls).sum() / end_loc)
     
        return ppl
    

