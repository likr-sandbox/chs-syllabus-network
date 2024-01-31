import argparse
import json
import jaconv
import spacy

nlp = spacy.load('ja_ginza')


def tokens(record):
    fields = ['授業概要', '授業のねらい・到達目標']
    for field in fields:
        for token in nlp(jaconv.normalize(record[field])):
            yield token.lemma_
    for text in record['授業計画']:
        for token in nlp(jaconv.normalize(text)):
            yield token.lemma_


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('input')
    parser.add_argument('output')
    args = parser.parse_args()
    with open(args.output, 'w') as f:
        for row in open(args.input):
            record = json.loads(row.strip())
            f.write(' '.join(list(tokens(record))) + '\n')


if __name__ == '__main__':
    main()
