import argparse
import json
import egraph as eg
import networkx as nx


def convert_graph(nx_graph, unit_edge_length=1):
    graph = eg.Graph()
    indices = {}
    for u in nx_graph.nodes:
        indices[u] = graph.add_node({})
    for u, v in nx_graph.edges:
        graph.add_edge(indices[u], indices[v], {})
    return graph, eg.all_sources_dijkstra(graph, lambda _: unit_edge_length)


def layout(graph, distance, iterations=100, eps=0.1, seed=0):
    drawing = eg.Drawing.initial_placement(graph)
    rng = eg.Rng.seed_from(seed)
    sgd = eg.FullSgd.new_with_distance_matrix(distance)
    scheduler = sgd.scheduler(iterations, eps)

    def step(eta):
        sgd.shuffle(rng)
        sgd.apply(drawing, eta)
    scheduler.run(step)

    return drawing


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('input')
    parser.add_argument('output')
    args = parser.parse_args()

    obj = json.load(open(args.input))
    graph = nx.node_link_graph(obj)
    cc = list(nx.connected_components(graph))
    mgraph = graph.subgraph(max(cc, key=len))
    print(mgraph.number_of_nodes(), mgraph.number_of_edges())

    g, d = convert_graph(mgraph)
    drawing = layout(g, d)
    pos = {u: (drawing.x(i), drawing.y(i)) for i, u in enumerate(mgraph.nodes)}

    for u in range(graph.number_of_nodes()):
        if u in mgraph.nodes:
            mgraph.nodes[u]['x'] = pos[u][0]
            mgraph.nodes[u]['y'] = pos[u][1]

    data = nx.node_link_data(mgraph)
    json.dump(data, open(args.output, 'w'), ensure_ascii=False)


if __name__ == '__main__':
    main()
