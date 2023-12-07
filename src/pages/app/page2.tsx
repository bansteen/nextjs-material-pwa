import { AppLayout } from 'components/layout'
import { useEffect, useState, useRef } from 'react';
import React from 'react';
import vis from 'vis-network';
import { makeStyles } from '@mui/styles';
import {
  Select, 
  MenuItem, 
  CircularProgress, 
  Grid,
  TextField,
  InputLabel,
  Switch,
  Button,
  Divider,
  Box,
  Typography,
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { DataSet } from 'vis-data';
import type { Node, Edge } from 'vis-network';
import {ServerResponseItem, transformResponse } from '../../graphData/graphDataChangeConnections';

interface ErrorDialogProps {
  open: boolean;
  onClose: () => void;
  message: string;
}
const ErrorDialog: React.FC<ErrorDialogProps> = ({ open, onClose, message }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Error</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

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
    width: '690px',
    height: '600px',
    // flex: 1,
    backgroundColor: 'black',
    padding: '0px',
    margin: '0px',
    boxSizing: 'border-box',
  },
  emptyBox: {
    width: '690px',
    height: '600px',
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
  const [selectedType, setSelectedType] = useState('Core Fan'); // Default selected type
  const [updateTrigger, setUpdateTrigger] = useState(false); // State for triggering useEffect
  const [loading, setLoading] = useState(false); // State for API loading indicator
  const [date, setDate] = useState(''); // State for the date input
  const [userIds, setUserIds] = useState(''); // State for user IDs input
  const [isMonthly, setIsMonthly] = useState(false);
  const [egoNetwork, setEgoNetwork] = useState(false);
  const [userIdError, setUserIdError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const runButtonRef = useRef<HTMLButtonElement | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [weight, setWeight] = useState(''); // State for the date input
  const handleParamChange = (event: SelectChangeEvent<string>) => {
    setSelectedType(event.target.value as string);
    setUpdateTrigger(!updateTrigger); // Toggle the updateTrigger value
  };
  const handleSwitchChange = () => {
    setIsMonthly(!isMonthly);
    setDate('');
  };
  const handleEgoNetworkChange = () => {
    setEgoNetwork(!egoNetwork);
  };
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  const handleUserIdsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = event.target.value;
  
    // Split input by comma or space and trim each element
    const separatedIds = rawInput.split(/,|\s/).map(id => id.trim());
  
    // Join the IDs with a comma and update the state
    setUserIds(separatedIds.join(','));
  };
  
  const handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(event.target.value);
  };
  const handleUpdateClick = () => {
    if (userIds.trim() === '') {
      setUserIdError(true);
      if (runButtonRef.current) {
        runButtonRef.current.focus();
      }
    } else {
      setUserIdError(false);
    }
  
    if (date.trim() === '') {
      setDateError(true);
      if (runButtonRef.current) {
        runButtonRef.current.focus();
      }
    } else {
      setDateError(false);
    }
  
    if (!userIdError || !dateError) {
      setUpdateTrigger(!updateTrigger);
    }
  };
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey) && runButtonRef.current) {
      runButtonRef.current.click();
    }
  };
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      handleKeyPress(event);
    };

    document.addEventListener('keydown', handleKeyDown); // Attach keydown event listener

    return () => {
      document.removeEventListener('keydown', handleKeyDown); // Remove event listener on unmount
    };
  }, []); // Empty dependency array ensures this effect runs only once
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true); // Start loading indicator when API call begins

        let tableName = '';
        if (selectedType === 'Core Fan') {
          tableName = isMonthly ? 'monthly_yell_core' : 'daily_yell_core';
        } else if (selectedType === 'Coins') {
          tableName = isMonthly ? 'monthly_coin_usage' : 'daily_coin_usage';
        }
        let dateParam = isMonthly ? `date=${date}-01` : `date=${date}`;
        let query = `${tableName}?${dateParam}&userids=${userIds.replace(/\s/g, '')}`;
        if(weight.length > 0) {
          query+= `&weight=${weight}`
        }
        if(egoNetwork){
          query+= `&egonet=on`
        } else {
          query+= `&egonet=off`
        }
        const apiUrl = `https://dena-pococha-ns-dev-gcp.an.r.appspot.com/api/data/${query}`;
        console.log('Url :'+ apiUrl)
        const response = await fetch(apiUrl);
        
        setLoading(false); // Stop loading indicator when API call completes
        if (!response.ok) {
          throw new Error('Failed to fetch data from the server');
        }
        const serverData: ServerResponseItem[] = await response.json();
        const transformedData = transformResponse(serverData, new Date(date),false); 
        if (transformedData.length === 0) {
          // Display error dialog if transformedData is empty
          setErrorDialogOpen(true);
          setErrorMessage('No data available.');
        } else {
          let counter = 1;
          transformedData.forEach((timeFrameData) => {
            const containerId = `mynetwork${counter}`;
            drawGraph(containerId, timeFrameData.nodes, timeFrameData.edges, timeFrameData.timeFrame);
            counter++;
          });
        }
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
      network.once('afterDrawing', () => {
        console.log("Drawing completed")
        const h3Element = container.parentElement?.querySelector('h3');
        if (h3Element) {
          h3Element.textContent = timeFrame;
        }
      });
      
      // Set the <h3> header to the timeFrame string
      const h3Element = container.parentElement?.querySelector('h3');
      if (h3Element) {
        h3Element.textContent = timeFrame + " ( now drawing...)";
      }

      return network;
    }
    if (updateTrigger) {
      fetchData()
      // After performing the needed operations, reset the updateTrigger
      setUpdateTrigger(false);
    }
  }, [selectedType, updateTrigger, date, isMonthly, userIds, weight, egoNetwork]);

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
          <Box style={{ width: 260, marginRight: '8px'}}>
            <InputLabel style={{ fontSize: 10}}>Enter user IDs separated by comma</InputLabel>
            <TextField
              InputProps={{
                style: { fontSize: 10, height: '30px' },
              }}
              style={{ width: '100%' }}
              value={userIds}
              onChange={handleUserIdsChange}
              error={userIdError} // Apply error style
            />
          </Box>

          <Divider orientation="vertical" flexItem/>

          <Box style={{ width: 160, marginRight: '8px'}}>
            <InputLabel style={{ fontSize: 10}}>Visualization period</InputLabel>
            <TextField
              InputProps={{
                style: { fontSize: 10, height: '30px' },
                className: dateError ? 'shake-animation' : '', // Apply animation class
              }}
              style={{ width: '100%' }}
              type={isMonthly ? "month" : "date"}
              value={date}
              onChange={handleDateChange}
              error={dateError} // Apply error style
            />
          </Box>

          <Box style={{ width: 128, marginRight: '8px', display: 'flex', alignItems: 'center' }}>
            <Typography style={{ fontSize: 10, color: !isMonthly ? 'blue' : 'initial', cursor: 'pointer' }} onClick={() => handleSwitchChange()}>Weekly</Typography>
            <Switch
              checked={isMonthly}
              onChange={handleSwitchChange}
            />
            <Typography style={{ fontSize: 10, color: !isMonthly ? 'initial' : 'blue', cursor: 'pointer' }} onClick={() => handleSwitchChange()}>Monthly</Typography>
          </Box>
          <Divider orientation="vertical" flexItem />

          <Box style={{ width: 140,  marginLeft: '8px' }}>
            <InputLabel style={{ fontSize: 10}}>Edge Types</InputLabel>
            <Select style={{ fontSize: 10, height:30}} value={selectedType} onChange={handleParamChange}>
            <MenuItem className={classes.menuItem} value="Core Fan">Core Fan</MenuItem>
            <MenuItem className={classes.menuItem} value="Coins">Coin Usage</MenuItem>
            </Select>
          </Box>

          <Box style={{ width: 80, marginRight: '8px'}}>
            <InputLabel style={{ fontSize: 10}}>Edge Threshold</InputLabel>
            <TextField
              InputProps={{
                style: { fontSize: 10, height: '30px' },
              }}
              style={{ width: '100%' }}
              onChange={handleWeightChange}
            />
          </Box>
          <Box style={{ width: 128, marginLeft: '8px', marginRight: '16px',display: 'flex', alignItems: 'center' }}>
            <Typography style={{ fontSize: 10, color: !egoNetwork ? 'blue' : 'initial', cursor: 'pointer' }} onClick={() => handleEgoNetworkChange()}>Ego Network Off</Typography>
            <Switch
            checked={egoNetwork}
            onChange={handleEgoNetworkChange}
            />
          <Typography style={{ fontSize: 10, color: !egoNetwork ? 'initial' : 'blue', cursor: 'pointer' }} onClick={() => handleEgoNetworkChange()}>Ego Network On</Typography>
          </Box>
          <Divider orientation="vertical" flexItem />

          <Button
            ref={runButtonRef}
            variant="contained"
            color="primary"
            style={{ height: 30, width: 48, marginLeft: '16px'}}
            onClick={handleUpdateClick}>
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
          <div id="config"></div>
        </div>
      )} 
        {/* ErrorDialog component */}
        <ErrorDialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)} message={errorMessage} />
      </div>
  );
};
AppIndex.layout = AppLayout
