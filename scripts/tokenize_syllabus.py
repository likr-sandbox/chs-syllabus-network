import json
import spacy
import jaconv


def main():
    data = [json.loads(s.strip()) for s in open('data/syllabus.jl')]
    nlp = spacy.load('ja_ginza')
    fields = ['授業概要', '授業のねらい・到達目標']
    words = [' '.join([t.norm_ for field in fields for t in nlp(jaconv.normalize(row[field]))] +
                      [t.norm_ for text in row['授業計画'] for t in nlp(jaconv.normalize(text))]) for row in data]
    with open('data/words.txt', 'w') as f:
        for row in words:
            f.write(row + '\n')


if __name__ == '__main__':
    main()
