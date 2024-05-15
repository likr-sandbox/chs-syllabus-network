import math
import json
import networkx as nx
import egraph as eg


def convert_graph(nx_graph):
    graph = eg.Graph()
    indices = {}
    edge_length = {}
    for u in nx_graph.nodes:
        indices[u] = graph.add_node({})
    for u, v in nx_graph.edges:
        e = graph.add_edge(indices[u], indices[v], {})
        edge_length[e] = 60
    cc = list(nx.connected_components(nx_graph))
    cc.sort(key=len, reverse=True)
    for i in range(1, len(cc)):
        c1 = cc[0]
        c2 = cc[i]
        u = max(c1, key=lambda u: len(graph.neighbors(u)))
        v = max(c2, key=lambda u: len(graph.neighbors(u)))
        e = graph.add_edge(u, v, {})
        edge_length[e] = 50 * (len(c1) ** 0.5 + len(c2) ** 0.5)
    return graph, indices, edge_length


def layout(graph, edge_lengths, r):
    def edge_length(e):
        return edge_lengths[e]
    distance = eg.all_sources_dijkstra(graph, edge_length)
    drawing = eg.DrawingEuclidean2d.initial_placement(graph)
    rng = eg.Rng.seed_from(0)
    sgd = eg.FullSgd.new_with_distance_matrix(distance)
    scheduler = sgd.scheduler(100, 0.1)
    overwrap_removal = eg.OverwrapRemoval(graph, lambda _: r)
    overwrap_removal.iterations = 20

    def step(eta):
        sgd.shuffle(rng)
        sgd.apply(drawing, eta)
        overwrap_removal.apply_with_drawing_euclidean_2d(drawing)
    scheduler.run(step)

    return drawing


def main():
    r = 15
    nx_graph = nx.node_link_graph(
        json.load(open('data/syllabus-network.json')))
    graph, indices, edge_length = convert_graph(nx_graph)
    drawing = layout(graph, edge_length, r)
    for u in nx_graph.nodes():
        nx_graph.nodes[u]['x'] = drawing.x(indices[u])
        nx_graph.nodes[u]['y'] = drawing.y(indices[u])
        nx_graph.nodes[u]['r'] = r
    json.dump(nx.node_link_data(nx_graph),
              open('public/syllabus-network.json', 'w'), ensure_ascii=False)


if __name__ == '__main__':
    main()
