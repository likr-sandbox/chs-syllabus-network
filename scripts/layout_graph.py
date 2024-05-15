import math
import json
import networkx as nx
import egraph as eg


def convert_graph(nx_graph):
    graph = eg.Graph()
    indices = {}
    for u in nx_graph.nodes:
        indices[u] = graph.add_node({})
    for u, v in nx_graph.edges:
        graph.add_edge(indices[u], indices[v], {})
    return graph, indices


def layout(graph, r, l):
    distance = eg.all_sources_dijkstra(graph, lambda _: l)
    drawing = eg.DrawingEuclidean2d.initial_placement(graph)
    rng = eg.Rng.seed_from(0)
    sgd = eg.FullSgd.new_with_distance_matrix(distance)
    scheduler = sgd.scheduler(100, 0.1)
    overwrap_removal = eg.OverwrapRemoval(graph, lambda _: r)
    overwrap_removal.iterations = 50

    def step(eta):
        sgd.shuffle(rng)
        sgd.apply(drawing, eta)
        overwrap_removal.apply_with_drawing_euclidean_2d(drawing)
    scheduler.run(step)
    drawing.centralize()

    return drawing


def main():
    r = 25
    r_margin = 5
    l = 100
    nx_graph = nx.node_link_graph(
        json.load(open('data/syllabus-network.json')))
    result = []
    for c in nx.connected_components(nx_graph):
        nx_subgraph = nx_graph.subgraph(c).copy()
        graph, indices = convert_graph(nx_subgraph)
        drawing = layout(graph, r + r_margin, l)
        for u in nx_subgraph.nodes:
            nx_subgraph.nodes[u]['x'] = drawing.x(indices[u])
            nx_subgraph.nodes[u]['y'] = drawing.y(indices[u])
            nx_subgraph.nodes[u]['r'] = r
        result.append(nx.node_link_data(nx_subgraph))
    json.dump(result, open('public/syllabus-network.json', 'w'),
              ensure_ascii=False)


if __name__ == '__main__':
    main()
