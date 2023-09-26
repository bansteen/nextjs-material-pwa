import { AppLayout } from 'components/layout'
import { useEffect, useState, ChangeEvent } from 'react';
import vis from 'vis-network';
import { makeStyles } from '@material-ui/core/styles';
import { DataSet } from 'vis-data';
import type { Node, Edge } from 'vis-network';
import { communityData } from '../../graphData/graphDataCommunityStructure';
import { Select, MenuItem } from '@material-ui/core';
type Color = string | vis.Color | undefined;

const useStyles = makeStyles(() => ({
  menu: {
    // position: 'fixed',
    marginTop: '16px',
    // right: '20px',
    zIndex: 1000, // Adjust the z-index as needed
    display: 'flex',
    alignItems: 'center',
  },
}));

export default function AppIndex() {
  const classes = useStyles();
  const [selectedSet, setSelectedSet] = useState('set1'); // Default selected set
  const [updateTrigger, setUpdateTrigger] = useState(true); // State for triggering useEffect
  const handleSetChange = (event: ChangeEvent<{ value: unknown }>) => {
    setSelectedSet(event.target.value as string); 
    setUpdateTrigger(!updateTrigger); // Toggle the updateTrigger value
  };
  useEffect(() => {
    let allNodes: Record<string, vis.Node>;
    let _allEdges: Record<string, vis.Edge>;
    let nodeColors: Record<string, Color>;
    let network: vis.Network;
    let options: vis.Options;
    let data: vis.Data;

    function drawGraph(containerId: string, nodes: Node[], edges: Edge[]) {
      const container = document.getElementById(containerId) as HTMLDivElement;
      const nodesDataSet = new DataSet<Node>(nodes);
      const edgesDataSet = new DataSet<Edge>(edges);

      nodeColors = {};
      allNodes = nodesDataSet.get({ returnType: 'Object' });
      for (const nodeId in allNodes) {
        nodeColors[nodeId] = allNodes[nodeId].color;
      }
      _allEdges = edgesDataSet.get({ returnType: 'Object' });
      data = { nodes, edges };

      options = {
        configure: {
          enabled: false,
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

      //options.configure.container = document.getElementById('config');
      network = new vis.Network(container, data, options);
      
      return network;
    }
    if (updateTrigger) {
      switch (selectedSet) {
        case 'set1':
          console.log("set 1 is drawn");
          drawGraph('mynetwork', communityData.community1.nodes, communityData.community1.edges);
          break;
        case 'set2':
          console.log("set 2 is drawn");
          drawGraph('mynetwork', communityData.community2.nodes, communityData.community2.edges);
          break;
        case 'set3':
          console.log("set 3 is drawn");
          drawGraph('mynetwork', communityData.community3.nodes, communityData.community3.edges);
          break;          
        // Add more cases for additional sets
        default:
          break;
      }
    }
    setUpdateTrigger(false);
  }, [selectedSet, updateTrigger]);

  return (
    <div>
      <div className={classes.menu}>
          <Select value={selectedSet} onChange={handleSetChange}>
            <MenuItem value="set1">Community 1</MenuItem>
            <MenuItem value="set2">Community 2</MenuItem>
            <MenuItem value="set3">Community 3</MenuItem>
            {/* Add more options for additional sets */}
          </Select>
        </div>
      <div id="mynetwork" style={{ height: '600px' }}></div>
      <div id="config"></div>
    </div>
  );
};
AppIndex.layout = AppLayout
