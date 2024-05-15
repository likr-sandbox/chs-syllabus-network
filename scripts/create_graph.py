import json
import networkx as nx
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import kneighbors_graph


def main():
    data = [json.loads(s.strip()) for s in open('data/syllabus.jl')]
    words = list([row.strip() for row in open('data/words.txt')])
    vectorizer = TfidfVectorizer(sublinear_tf=True)
    X = vectorizer.fit_transform(words)
    A = kneighbors_graph(X, 3, mode='connectivity',
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
            if A[u, v] != 0:
                graph.add_edge(u, v)
    json.dump(nx.node_link_data(graph),
              open('data/syllabus-network.json', 'w'), ensure_ascii=False)


if __name__ == '__main__':
    main()
