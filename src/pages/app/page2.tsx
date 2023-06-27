import { AppLayout } from 'components/layout'
import { useEffect } from 'react';
import vis from 'vis-network';
import { DataSet } from 'vis-data';

type Color = string | vis.Color | undefined;

export default function AppIndex() {
  useEffect(() => {
    let edges: DataSet<vis.Edge>;
    let nodes: DataSet<vis.Node>;
    let allNodes: Record<string, vis.Node>;
    let _allEdges: Record<string, vis.Edge>;
    let nodeColors: Record<string, Color>;
    //let originalNodes: any;
    let network: vis.Network;
    let container: HTMLDivElement;
    let options: vis.Options;
    let data: vis.Data;

    function drawGraph() {
      container = document.getElementById('mynetwork') as HTMLDivElement;

      nodes = new DataSet<vis.Node>([
        { color: "#97c2fc", id: 732576, label: "風喜(ふうき🍓)🧞🎸", shape: "dot", size: 12.979576003669171 },
        { color: "#97c2fc", id: 1782690, label: "ノバフミヤ👶🏻🎤🎤", shape: "dot", size: 12.349263685722216 },
        { color: "#97c2fc", id: 5208580, label: "🌻権里🌻3周年🎉", shape: "dot", size: 3.1290150749321373 },
        { color: "#97c2fc", id: 2578378, label: "しろ🐰ིཀྀ", shape: "dot", size: 3.2800680965185367 },
        { color: "#97c2fc", id: 2807281, label: "FUYU✖️🥁🛀🇣🇷", shape: "dot", size: 12.73281347289798 },
        { color: "#97c2fc", id: 2669105, label: "ちゃぴ🧭‪‪ ‪\ud80c\ude12\ud80c\udff8", shape: "dot", size: 8.398948618082136 },
        { color: "#97c2fc", id: 47089, label: "🥼airi🥼🦌", shape: "dot", size: 3.4887533059868776 },
        { color: "#97c2fc", id: 4004536, label: "🌃🌼Yurry🌼🌃", shape: "dot", size: 5.029547118662518 },
        { color: "#97c2fc", id: 6526586, label: "おやちけあきんぴ✍️🥚🐚", shape: "dot", size: 10.52475737309722 },
        { color: "#97c2fc", id: 1782872, label: "育休👶🏻ちろるちょこ💚♪̈♪̆", shape: "dot", size: 1.7039767246444233 },
        { color: "#97c2fc", id: 2719772, label: "あいりー🎤🐈", shape: "dot", size: 13.976841608505092 },
        { color: "#97c2fc", id: 788063, label: "Sharo🐰🌙✨", shape: "dot", size: 12.406438917281692 },
      ]);

      edges = new DataSet<vis.Edge>([
        { arrows: 'to', from: 4004536, to: 732576 },
        { arrows: 'to', from: 1782690, to: 732576 },
        { arrows: 'to', from: 2807281, to: 732576 },
        { arrows: 'to', from: 6526586, to: 2807281 },
        { arrows: 'to', from: 2669105, to: 2807281 },
        { arrows: 'to', from: 1782690, to: 2669105 },
        { arrows: 'to', from: 2669105, to: 1782690 },
        { arrows: 'to', from: 732576, to: 1782690 },
        { arrows: 'to', from: 1782690, to: 2807281 },
        { arrows: 'to', from: 788063, to: 6526586 },
        { arrows: 'to', from: 732576, to: 6526586 },
        { arrows: 'to', from: 1782690, to: 6526586 },
        { arrows: 'to', from: 2719772, to: 6526586 },
        { arrows: 'to', from: 2669105, to: 2719772 },
        { arrows: 'to', from: 2719772, to: 2807281 },
        { arrows: 'to', from: 2719772, to: 788063 },
        { arrows: 'to', from: 1782690, to: 788063 },
        { arrows: 'to', from: 6526586, to: 788063 },
        { arrows: 'to', from: 732576, to: 788063 },
        { arrows: 'to', from: 788063, to: 2719772 },
        { arrows: 'to', from: 732576, to: 2578378 },
        { arrows: 'to', from: 2807281, to: 788063 },
        { arrows: 'to', from: 2669105, to: 47089 },
        { arrows: 'to', from: 788063, to: 1782690 },
        { arrows: 'to', from: 2719772, to: 2669105 },
        { arrows: 'to', from: 732576, to: 4004536 },
        { arrows: 'to', from: 732576, to: 2719772 },
        { arrows: 'to', from: 4004536, to: 5208580 },
        { arrows: 'to', from: 47089, to: 2669105 },
        { arrows: 'to', from: 4004536, to: 2807281 },
        { arrows: 'to', from: 2719772, to: 732576 },
        { arrows: 'to', from: 1782872, to: 2807281 },
        { arrows: 'to', from: 732576, to: 2807281 },
        { arrows: 'to', from: 1782872, to: 732576 },
        { arrows: 'to', from: 2719772, to: 1782690 },
        { arrows: 'to', from: 6526586, to: 1782690 },
        { arrows: 'to', from: 6526586, to: 732576 },
        { arrows: 'to', from: 1782690, to: 4004536 },
        { arrows: 'to', from: 6526586, to: 2719772 },
        { arrows: 'to', from: 2807281, to: 2719772 },
      ]);

      nodeColors = {};
      allNodes = nodes.get({ returnType: 'Object' });
      for (const nodeId in allNodes) {
        nodeColors[nodeId] = allNodes[nodeId].color;
      }
      _allEdges = edges.get({ returnType: 'Object' });
      data = { nodes, edges };

      options = {
        configure: {
          enabled: true,
          filter: ['physics', 'nodes'],
        },
        edges: {
          color: {
            inherit: true,
          },
          smooth: {
            enabled: true,
            type: 'dynamic',
            roundness: 0.5, // Add roundness property with a value
          },
        },
        interaction: {
          dragNodes: true,
          hideEdgesOnDrag: false,
          hideNodesOnDrag: false,
        },
        physics: {
          enabled: true,
          stabilization: {
            enabled: true,
            fit: true,
            iterations: 1000,
            onlyDynamicEdges: false,
            updateInterval: 50,
          },
        },
      };

      options.configure.container = document.getElementById('config');
      network = new vis.Network(container, data, options);
      
      return network;
    }

    drawGraph();
  }, []);

  return (
    <div>
      <div id="mynetwork" style={{ height: '600px' }}></div>
      <div id="config"></div>
    </div>
  );
};
AppIndex.layout = AppLayout
