import { AppLayout } from 'components/layout'
import { useEffect, useState, ChangeEvent } from 'react';
import vis from 'vis-network';
import { makeStyles } from '@material-ui/core/styles';
import { Select, MenuItem } from '@material-ui/core';
import { DataSet } from 'vis-data';
import type { Node, Edge } from 'vis-network';
import { jsonData, broadcasterData, TimeFrameData, ParamsDataSet } from '../../graphData/graphDataChangeConnections';
type Color = string | vis.Color | undefined;

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: '0px',
    boxSizing: 'border-box',
    margin: '0 auto',
  },
  box: {
    width: '390px',
    height: '300px',
    // flex: 1,
    backgroundColor: 'black',
    padding: '0px',
    margin: '0px',
    boxSizing: 'border-box',
  },
  emptyBox: {
    width: '390px',
    height: '300px',
    // flex: 1,
    //backgroundColor: 'lightgray',
    padding: '0px',
    margin: '0px',
    boxSizing: 'border-box',
  },
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
  const [selectedSet, setSelectedSet] = useState('moms'); // Default selected set
  const [selectedType, setSelectedType] = useState('coin'); // Default selected type
  const [updateTrigger, setUpdateTrigger] = useState(true); // State for triggering useEffect

  const handleParamChange = (event: ChangeEvent<{ value: unknown }>) => {
    setSelectedType(event.target.value as string);
    setUpdateTrigger(!updateTrigger); // Toggle the updateTrigger value
  };
  const handleTypeChange = (event: ChangeEvent<{ value: unknown }>) => {
    setSelectedSet(event.target.value as string);
    setUpdateTrigger(!updateTrigger); // Toggle the updateTrigger value
  };
  console.log(jsonData);
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

    function drawGraph(containerId: string, nodes: Node[], edges: Edge[], timeFrame: string) {
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
      
      // Set the <h3> header to the timeFrame string
      const h3Element = container.parentElement?.querySelector('h3');
      if (h3Element) {
        h3Element.textContent = timeFrame;
      }

      return network;
    }
    if (updateTrigger) {
      let selectedData: TimeFrameData[] = [];
      switch (selectedSet) {
        case 'beginner':
          selectedData = (broadcasterData.beginnerFemale[selectedType as keyof ParamsDataSet] as TimeFrameData[]) || [];
          break;
        case 'moms':
          selectedData = (broadcasterData.moms[selectedType as keyof ParamsDataSet] as TimeFrameData[]) || [];
          break;
        // Add more cases for additional sets
        default:
          break;
      }
      console.log(selectedType);
      // Render the div elements for different time frames here
      let counter = 1;
      selectedData.forEach((timeFrameData: TimeFrameData) => {
        const containerId = `mynetwork${counter}`;
        drawGraph(containerId, timeFrameData.nodes, timeFrameData.edges, timeFrameData.timeFrame);
        counter++;
      });
      // After performing the needed operations, reset the updateTrigger
      setUpdateTrigger(false);
    }
  }, [selectedSet, selectedType, updateTrigger]);

  return (
    <div>
      <div className={classes.container}>
        <div className={classes.menu}>
            <Select value={selectedSet} onChange={handleTypeChange}>
              <MenuItem value="beginner">Beginner female</MenuItem>
              <MenuItem value="moms">Moms</MenuItem>
              {/* Add more options for additional sets */}
            </Select>
          </div>
          <div className={classes.menu}>
            <Select value={selectedType} onChange={handleParamChange}>
              <MenuItem value="coin">Coin count</MenuItem>
              <MenuItem value="comment">Comment count</MenuItem>
              <MenuItem value="follow">Follow count</MenuItem>
              <MenuItem value="gift">Gift count</MenuItem>
              <MenuItem value="view">View count</MenuItem>
              <MenuItem value="viewTotal">View total time count</MenuItem>
              {/* Add more options for additional sets */}
            </Select>
          </div>
      </div> 
      <div className={classes.container}>
        <div>
          <h3>Date range1</h3>
          <div id="mynetwork1" className={classes.box}>
          </div>
        </div>
        <div>
          <h3>Date range2</h3>
          <div id="mynetwork2" className={classes.box}>
          </div>
        </div>
        <div>
          <h3>Date range3</h3>
          <div id="mynetwork3" className={classes.box}>
          </div>
        </div>
        <div>
          <h3>Date range4</h3>
          <div id="mynetwork4" className={classes.box}>
          </div>
        </div>
        <div>
          <h3>Date range5</h3>
          <div id="mynetwork5" className={classes.box}></div>
        </div>
        <div>
          <div id="empty" className={classes.emptyBox}></div>
        </div>
      </div>
        <div id="config"></div>
    </div>
  );
};
AppIndex.layout = AppLayout
