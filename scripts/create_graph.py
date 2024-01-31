import argparse
import json
import networkx as nx
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import kneighbors_graph


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('input_data')
    parser.add_argument('input_words')
    parser.add_argument('output')
    parser.add_argument('-k', default=2, type=int)
    args = parser.parse_args()

    data = [json.loads(s.strip()) for s in open(args.input_data)]
    words = [row.strip() for row in open(args.input_words)]
    vectorizer = TfidfVectorizer(sublinear_tf=True)
    X = vectorizer.fit_transform(words)
    A = kneighbors_graph(X, args.k, mode='connectivity',
                         include_self=False).toarray()
    graph = nx.Graph()
    n = A.shape[0]
    for u in range(n):
        graph.add_node(
            u,
            科目ID=u,
            科目名=data[u].get('令和２年度以降入学者', ''),
            科目群=data[u].get('科目群'),
            教員名=data[u]['教員名'],
        )
    for u in range(n):
        for v in range(u):
            if A[u, v] != 0 or A[v, u] != 0:
                graph.add_edge(u, v)
    obj = nx.node_link_data(graph)
    json.dump(obj, open(args.output, 'w'), ensure_ascii=False)


if __name__ == '__main__':
    main()
