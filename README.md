# CatchGPT

CatchGPT is a tool that can determine if a particular text is written by an AI or a human being by analyzing the text's average perplexity per line score and its burstiness.

In general, perplexity is the measurement of how likely the model can predict the next word in an input text sequence. This is often used to gauge the performance of a natural language processing model. Texts with a high perplexity value are generally written by humans, while AI-generated text typically has lower perplexity values.

Additionally, in our case, burstiness refers to the variation (standard deviation was used in this implementation) in perplexity per sentence/line. Typically, humans tend to write in a "bursty fashion" as we would generally have short sentences mixed in with long sentences. On the other hand, NLP models typically write in a "uniform fashion" where almost all sentences have a similar length. Thus, text generated by ais such as ChatGPT, YouChat, Bing Search, and others, will have lower values of burstiness in comparison to human-written text.

## Motivation

This application was inspired by the rise of ChatGPT and its widespread use of plagiarism within the academic space. Similar applications have been made with similar implementations, but are behind a paywall (GPTZero has now limited its use to 1 request per hour). With this in mind, I wanted to make a more accessible application for all students and educators who want to check if a particular piece of text had been produced entirely by an AI, partially by an AI, or entirely produced by a human. Though this implementation is not entirely accurate and can be deceived by manually adding burstiness and perplexity to every sentence, it can be used in conjunction with human input to determine if a particular piece of text had been produced with the aid of an AI.

I have plans to incorporate the [DetectGPT](https://arxiv.org/pdf/2301.11305.pdf) implementation in the near future to gain a better understanding of Machine-Generated Text (NLP Models), its detection, and learn more about machine learning.

## Technologies

Python (Flask), Hugging Face Pretrained GPT2 Model (to calculate perplexity of fixed-length models), JavaScript (jQuery), jCharts, HTML/CSS 

## How to run

```
pip install -r requirements.txt
```

```
python3 app.py
```

## Acknowledgement

Utilized Hugging Face to calculate the perplexity of a given text.
- [https://huggingface.co/docs/transformers/perplexity](https://huggingface.co/docs/transformers/perplexity)

Research on Perplexity in Language Models
- [https://towardsdatascience.com/perplexity-in-language-models-87a196019a94](https://towardsdatascience.com/perplexity-in-language-models-87a196019a94)

Inspiration from GPTZero
- [GPTZero](https://gptzero.me/)
