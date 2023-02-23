import re
import torch
import numpy as np
from transformers import GPT2LMHeadModel, GPT2TokenizerFast
from tqdm import tqdm

# print(torch.cuda.is_available())
# print(torch.zeros(1).cuda())


class model:
    def __init__(self):
        self.device = "cuda"
        self.model_id = "gpt2"
        self.model = GPT2LMHeadModel.from_pretrained(self.model_id).to(self.device)
        self.tokenizer = GPT2TokenizerFast.from_pretrained(self.model_id)
        self.max_length = self.model.config.n_positions
        self.stride = 512

    def __call__(self, text):
        lines = re.split('\.[ | \n]', text)
        perplexity_per_line = []
        for i, line in enumerate(lines):
            if i < len(lines)-1:
                line = line + "."
            if lines[0] == "\n":
                line = line[1:]
            print(line)
            pps = self.getPerplexityPerLine(line).item()
            perplexity_per_line.append(pps)
            print(pps)

        print(perplexity_per_line)

        data = np.array(perplexity_per_line)
        burstiness = np.std(data)
        avgPP = sum(perplexity_per_line) / len(perplexity_per_line)
        print("Avg Perplexity", avgPP)
        print("Sample Burstiness", burstiness)
        output = dict()
        output['avgPP'] = avgPP
        output['burstiness'] = burstiness
        output['PPL'] = perplexity_per_line
        output['text'] = text

        return output

    def getPerplexityPerLine(self, line):
        encodings = self.tokenizer(line, return_tensors="pt")
        seq_len = encodings.input_ids.size(1)

        nlls = []
        prev_end_loc = 0
        for begin_loc in tqdm(range(0, seq_len, self.stride)):
            end_loc = min(begin_loc + self.max_length, seq_len)
            trg_len = end_loc - prev_end_loc  # may be different from stride on last loop
            input_ids = encodings.input_ids[:, begin_loc:end_loc].to(self.device)
            target_ids = input_ids.clone()
            target_ids[:, :-trg_len] = -100

            with torch.no_grad():
                outputs = self.model(input_ids, labels=target_ids)

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
    




# testModel = model()
# testModel("Flask is a popular open-source micro web framework for building web applications in Python. It was developed by Armin Ronacher and released in 2010. Flask is designed to be lightweight and flexible, making it easy to get started with and to customize to your needs. It is used by many developers to create simple to complex web applications and APIs. Flask is built on top of the Werkzeug toolkit, which provides low-level utilities for handling HTTP requests and responses, and the Jinja2 templating engine, which allows you to easily create dynamic HTML pages. Flask also provides a number of extensions that you can use to add additional functionality to your application, such as authentication, database integration, and more. One of the key benefits of Flask is its simplicity and minimalism. Flask has a small core that provides basic features, such as routing and request handling, but leaves the rest of the functionality up to you. This allows you to build your application in a modular way, adding only the features you need and keeping your codebase small and maintainable. Flask is often compared to other popular web frameworks such as Django, Pyramid, and Bottle. While these frameworks provide more out-of-the-box features than Flask, they can also be more complex and require more setup time. Flask is a good choice if you want a lightweight and flexible framework that you can customize to your needs.")