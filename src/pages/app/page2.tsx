import { AppLayout } from 'components/layout'
import { useEffect, useState } from 'react';
import vis from 'vis-network';
import { makeStyles } from '@mui/styles';
import {
  Select, 
  MenuItem, 
  CircularProgress, 
  Grid,
  TextField,
  InputLabel,
  FormControl,
  Slider,
  Switch,
  Button,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { DataSet } from 'vis-data';
import type { Node, Edge } from 'vis-network';
import {ServerResponseItem, transformResponse } from '../../graphData/graphDataChangeConnections';
type Color = string | vis.Color | undefined;

const useStyles = makeStyles(() => ({
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
  progressContainer: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItem: {
    fontSize: 10,
  },
  customTextField: {
    fontSize: 10,
    width: '100%',
    height: 30, // Set the desired height here
  },
}));

export default function AppIndex() {
  const classes = useStyles();
  const [selectedSet, setSelectedSet] = useState('mom'); // Default selected set
  const [selectedType, setSelectedType] = useState('coins'); // Default selected type
  const [updateTrigger, setUpdateTrigger] = useState(true); // State for triggering useEffect
  const [loading, setLoading] = useState(false); // State for API loading indicator

  const handleParamChange = (event: SelectChangeEvent<string>) => {
    setSelectedType(event.target.value as string);
    setUpdateTrigger(!updateTrigger); // Toggle the updateTrigger value
  };
  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    setSelectedSet(event.target.value as string);
    setUpdateTrigger(!updateTrigger); // Toggle the updateTrigger value
  };
  const [isWeekly, setIsWeekly] = useState(false);
  const handleSwitchChange = () => {
    setIsWeekly(!isWeekly);
  };
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true); // Start loading indicator when API call begins

        const dataSetId = `change_connections_${selectedSet}_${selectedType}`;
        const apiUrl = `https://networkdata.onrender.com/api/data/${dataSetId}`;
        
        const response = await fetch(apiUrl);
        
        
        setLoading(false); // Stop loading indicator when API call completes
        if (!response.ok) {
          throw new Error('Failed to fetch data from the server');
        }
        
        const serverData: ServerResponseItem[] = await response.json();
        const transformedData = transformResponse(serverData); 
        console.log(transformedData)
        // Render the div elements for different time frames here
        // let counter = 1;
        // selectedData.forEach((timeFrameData: TimeFrameData) => {
        //   const containerId = `mynetwork${counter}`;
        //   drawGraph(containerId, timeFrameData.nodes, timeFrameData.edges, timeFrameData.timeFrame);
        //   counter++;
        // });

        let counter = 1;
        transformedData.forEach((timeFrameData) => {
          const containerId = `mynetwork${counter}`;
          drawGraph(containerId, timeFrameData.nodes, timeFrameData.edges, timeFrameData.timeFrame);
          counter++;
        });
        // Process and use the data as needed
        console.log(data);
      } catch (error) {
        setLoading(false); // Stop loading indicator when API call completes
        console.error('Error fetching data:', error);
        // Handle the error here
      } finally {
        setLoading(false); // Stop loading indicator when API call completes
      }
    }
    let allNodes: Record<string, vis.Node>;
    let _allEdges: Record<string, vis.Edge>;
    let nodeColors: Record<string, Color>;
    //let originalNodes: any;
    let network: vis.Network;
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
      switch (selectedSet) {
        case 'beggFemale':
          fetchData()
          break;
        case 'mom':
          fetchData()
          break;
        // Add more cases for additional sets
        default:
          break;
      }
      console.log(selectedType);
      // After performing the needed operations, reset the updateTrigger
      setUpdateTrigger(false);
    }
  }, [selectedSet, selectedType, updateTrigger]);

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column'}}>
        <div
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            paddingTop: '8px',
            paddingBottom: '8px',
          }}
        >
          <Box style={{width: 100, marginRight: '8px'}}>
            <Select style={{ fontSize: 10, height:30}} value={selectedSet} onChange={handleTypeChange}>
              <MenuItem className={classes.menuItem} value="beggFemale">Beginner female</MenuItem>
              <MenuItem className={classes.menuItem} value="mom">Moms</MenuItem>
            </Select>
          </Box>
          <Box style={{ width: 260, marginRight: '8px'}}>
            <InputLabel style={{ fontSize: 10}}>Enter user IDs separated by comma</InputLabel>
            <TextField
              InputProps={{
                style: { fontSize: 10, height: '30px' },
              }}
              style={{ width: '100%' }}
            />
          </Box>

          <Divider orientation="vertical" flexItem/>

          <Box style={{ width: 160, marginRight: '8px'}}>
            <InputLabel style={{ fontSize: 10}}>Visualization period</InputLabel>
            <TextField
              InputProps={{
                style: { fontSize: 10, height: '30px' },
              }}
              style={{ width: '100%' }}
              type = "month"
            />
          </Box>

          <Box style={{ width: 128, marginRight: '8px', display: 'flex', alignItems: 'center' }}>
            <Typography style={{ fontSize: 10, color: !isWeekly ? 'blue' : 'initial', cursor: 'pointer' }} onClick={() => handleSwitchChange()}>Weekly</Typography>
            <Switch
              checked={isWeekly}
              onChange={handleSwitchChange}
            />
            <Typography style={{ fontSize: 10, color: !isWeekly ? 'initial' : 'blue', cursor: 'pointer' }} onClick={() => handleSwitchChange()}>Monthly</Typography>
          </Box>
          <Divider orientation="vertical" flexItem />

          <Box style={{ width: 140,  marginLeft: '8px' }}>
            <InputLabel style={{ fontSize: 10}}>Edge Types</InputLabel>
            <Select style={{ fontSize: 10, height:30}} value={selectedType} onChange={handleParamChange}>
              <MenuItem className={classes.menuItem} value="coins">Coins</MenuItem>
              <MenuItem className={classes.menuItem} value="comment">Comments</MenuItem>
              <MenuItem className={classes.menuItem} value="follow">Follows</MenuItem>
              <MenuItem className={classes.menuItem} value="gift">Gifts</MenuItem>
              <MenuItem className={classes.menuItem} value="view">Views</MenuItem>
              <MenuItem className={classes.menuItem} value="totalTime">Total time</MenuItem>
            </Select>
          </Box>

          <Box style={{ width: 80, marginRight: '8px'}}>
            <InputLabel style={{ fontSize: 10}}>Edge Threshold</InputLabel>
            <TextField
              InputProps={{
                style: { fontSize: 10, height: '30px' },
              }}
              style={{ width: '100%' }}
            />
          </Box>

          <Divider orientation="vertical" flexItem />

          <Button
            variant="contained"
            color="primary"
            style={{ height: 30, width: 48, marginLeft: '16px',}}
          >
            Run
          </Button>
        </div>
        <Divider />
      </div>
      {loading ? (
        <Grid container className={classes.progressContainer}>
          <CircularProgress />
        </Grid>
      ) : (
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
      )} 
        <div id="config"></div>
      </div>
  );
};
AppIndex.layout = AppLayout
