import { AppLayout } from 'components/layout'
import {useEffect, useState, useRef } from 'react';
import vis from 'vis-network';
import React from 'react';
import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';
import { getUserEmail } from '../_app'
import html2canvas from 'html2canvas';
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
  IconButton,
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Checkbox,
  Tooltip
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { DataSet } from 'vis-data';
import type { Node, Edge } from 'vis-network';
import {ServerResponseItem, transformResponse } from '../../graphData/graphDataChangeConnections';
import ModalLists from './modalGetLinks';
import ModalAddLinks from './modalAddLinks';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import GetAppIcon from '@mui/icons-material/GetApp';
import ListIcon from '@mui/icons-material/List';
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
  networkHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  box: {
    width: '690px',
    height: '600px',
    // flex: 1,
    backgroundColor: 'white',
    padding: '32px',
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
interface Networks {
  [key: string]: vis.Network | undefined;
}
interface ContainerNetworkMap {
  containerId: string;
  network: vis.Network;
}
export default function AppIndex() {
  const router = useRouter();
  const [networks, setNetworks] = useState<Networks>({}); 
  const classes = useStyles();
  const [selectedType, setSelectedType] = useState('Core Fan'); // Default selected type
  const [updateTrigger, setUpdateTrigger] = useState(false); // State for triggering useEffect
  const [loading, setLoading] = useState(false); // State for API loading indicator
  const [date, setDate] = useState(''); // State for the date input
  const [userIds, setUserIds] = useState(''); // State for user IDs input
  const [email, setEmail] = useState(''); // State for user IDs input
  const [isMonthly, setIsMonthly] = useState(true);
  const [coreFan, setCoreFan] = useState(true);
  const [showName, setShowName] = useState(false);
  const [egoNetwork, setEgoNetwork] = useState(false);
  const [tableName, setTablename] = useState('monthly_yell_core');
  const [userIdError, setUserIdError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const runButtonRef = useRef<HTMLButtonElement | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState<boolean>(false);
  const [runPressed, setRunPressed] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [weight, setWeight] = useState('0'); 
  const [selectedNodeId, setSelectedNodeId] = useState('');
  const containerToNetworkMap: ContainerNetworkMap[] = [];
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [showGrid2, setShowGrid2] = useState<boolean>(false);
  const [showGrid3, setShowGrid3] = useState<boolean>(false);
  const [showGrid4, setShowGrid4] = useState<boolean>(false);
  const [showGrid5, setShowGrid5] = useState<boolean>(false);
  const handleParamChange = (event: SelectChangeEvent<string>) => {
    setSelectedType(event.target.value as string);
    if(event.target.value == "Core Fan"){
      setIsMonthly(true)
      setCoreFan(true)
      setTablename(isMonthly ? 'monthly_yell_core' : 'daily_yell_core')
    } else if(event.target.value == "Coin Usage"){
      setCoreFan(false)
      setTablename(isMonthly ? 'monthly_coin_usage' : 'daily_coin_usage')
    }else if(event.target.value == "Item Usage"){
      setCoreFan(false)
      setTablename(isMonthly ? 'monthly_item_usage_count' : 'daily_item_usage_count')
    }else if(event.target.value == "Paid Coins"){
      setCoreFan(false)
      setTablename(isMonthly ? 'monthly_paid_coin_usage' : 'daily_paid_coin_usage')
    }
  };
  const handleSwitchChange = () => {
    if(coreFan){
      setIsMonthly(true)
      setTablename('monthly_yell_core')
    } else {
      if(selectedType == 'Coin Usage') {
        setTablename(!isMonthly ? 'monthly_coin_usage' : 'daily_coin_usage')
        setIsMonthly(!isMonthly);
        setDate('');
      }else {
        setTablename(!isMonthly ? 'monthly_item_usage_count' : 'daily_item_usage_count')
        setIsMonthly(!isMonthly);
        setDate('');
      }
      
    }
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
    setUserIds(separatedIds.join(','));
  };
  const handleShowNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowName(event.target.checked);
  };
  const handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(event.target.value);
  };
  const handleRunClick = () => {
    let generateUrl = false
    if (userIds.trim() === '') {
      setUserIdError(true);
      generateUrl = false
      if (runButtonRef.current) {
        runButtonRef.current.focus();
      }
    } else {
      generateUrl = true
      setUserIdError(false);
    }
  
    if (date.trim() === '') {
      generateUrl = false
      setDateError(true);
      if (runButtonRef.current) {
        runButtonRef.current.focus();
      }
    } else {
      generateUrl = true
      setDateError(false);
    }
    const separatedIds = userIds.split(/,|\s/).map(id => id.trim());
    if (separatedIds.length > 100) {
      setErrorDialogOpen(true);
      setErrorMessage('Number of user IDs cannot exceed 100');      
      generateUrl = false
      if (runButtonRef.current) {
        runButtonRef.current.focus();
      }
    }
    if (generateUrl) {
      const queryParams = {
        edge_type: tableName,
        start_date: date,
        userids: userIds,
        egonet: egoNetwork?'on':'off',
        showname: showName?'on':'off',
        edge_threshold: weight,
      };
      const queryString = new URLSearchParams(queryParams).toString();
      const newUrl = `/app/?${queryString}`;
      setRunPressed(true)
      router.push(newUrl);
    }
  };
  const handleStopClick = () => {
    Object.values(networks).forEach((network) => {
      if (network) {
        console.log("Stopping network");
        network.setOptions( { physics: false } );
        //network.stopSimulation();
      }
    });
  };
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey) && runButtonRef.current) {
      runButtonRef.current.click();
    }
  };
  const [isModalGetLinksOpen, setIsModalGetLinksOpen] = useState(false);
  const [isModalAddLinksOpen, setIsModalAddLinksOpen] = useState(false);
  const [refreshLinks, setRefreshLinks] = useState(false);
  const [isUserList, setIsUserList] = useState(false);
  const handleOpenModalGetLinks = () => {
    setIsModalGetLinksOpen(true);
  };

  const handleCloseModalGetLinks = (userIds?: string) => {
    setIsModalGetLinksOpen(false);
    if (userIds) {
      setUserIds(userIds)
    } else {
      setUserIds('')
    }
  };

  const handleOpenModalAddLinks = () => {
    setIsModalAddLinksOpen(true);
  };
  const openAddLinksModal = (isUserList: boolean) => {
    setIsModalAddLinksOpen(true);
    setIsUserList(isUserList);
  };
  const handleCloseModalAddLinks = () => {
    setIsModalAddLinksOpen(false);
  };
  const refreshLinksList = () => {
    setRefreshLinks((prev) => !prev);
  };
  const captureAndSaveImage = () => {
    const maxCount = isMonthly? 1: 5
    for (let i = 1; i <= maxCount; i++) {
      const divId = `n${i}`;
      const node = document.getElementById(divId); // Get the element by id

      if (node) {
        // Use html2canvas to capture the content of the div
        html2canvas(node).then((canvas) => {
          const dataUrl = canvas.toDataURL();
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = `network${i}.png`
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
      }      
    }
  };  
  const handleShowGridChange = () => {
    setShowGrid((prevShowGrid) => !prevShowGrid);
  };
  const handleShowGridChange2 = () => {
    setShowGrid2((prevShowGrid) => !prevShowGrid);
  };
  const handleShowGridChange3 = () => {
    setShowGrid3((prevShowGrid) => !prevShowGrid);
  };
  const handleShowGridChange4 = () => {
    setShowGrid4((prevShowGrid) => !prevShowGrid);
  };
  const handleShowGridChange5 = () => {
    setShowGrid5((prevShowGrid) => !prevShowGrid);
  };
  useEffect(() => {
    getUserEmail().then((userEmail) => {
      if (userEmail) {
        console.log("userEmail:"+userEmail)
        setEmail(userEmail)
        // Use userEmail in your logic here
      } else {
        console.log("userEmail:"+userEmail)
        setEmail("Unknown")
      }
    });    
    const handleKeyDown = (event: KeyboardEvent) => {
      handleKeyPress(event);
    };

    document.addEventListener('keydown', handleKeyDown); // Attach keydown event listener

    return () => {
      document.removeEventListener('keydown', handleKeyDown); // Remove event listener on unmount
    };
  }, []); // Empty dependency array ensures this effect runs only once
  useEffect(() => {
    // Accessing query parameters
    const { query } = router;
    // Accessing specific parameters
    const { edge_type, start_date, userids, egonet, showname, edge_threshold} = query;
    if(edge_type !=undefined && start_date != undefined && userids != undefined
      && egonet != undefined && showname != undefined) {
        const edgeTypeString = edge_type.toString()
        let startDateString = start_date.toString()
        const egonetString = egonet.toString()
        const shownameString = showname.toString()
        const isMonthly = edgeTypeString.startsWith('month')
        const egoNet = egonetString == 'on'
        const showName = shownameString == 'on'
        const edgeThresholdString = edge_threshold?.toString() || '0'
        setIsMonthly(isMonthly)
        if (isMonthly) {
          const yearMonth = startDateString.slice(0, 7)
          startDateString = yearMonth
          setDate(yearMonth)
        } else {
          setDate(startDateString)
        }
        setEgoNetwork(egoNet)
        setShowName(showName)
        setTablename(edgeTypeString)
        setWeight(edgeThresholdString)
        
        switch(edgeTypeString) {
          case 'daily_yell_core':
            setSelectedType('Core Fan')
            break
          case 'monthly_yell_core':
            setSelectedType('Core Fan')
            break
          case 'daily_coin_usage':
            setSelectedType('Coin Usage')
            break
          case 'monthly_coin_usage':
            setSelectedType('Coin Usage')
            break
          case 'daily_item_usage_count':
            setSelectedType('Item Usage')
            break
          case 'monthly_item_usage_count':
            setSelectedType('Item Usage')
            break
          case 'monthly_paid_coin_usage':
            setSelectedType('Paid Coins')
            break
          case 'daily_paid_coin_usage':
            setSelectedType('Paid Coins')
            break            
        }
        if (userids && typeof userids === 'string') {
          setUserIds(userids);
          fetchData(edgeTypeString,userids,startDateString,isMonthly,egoNet,showName,edgeThresholdString,runPressed)  
        }
    }
    if (updateTrigger) {
      fetchData(tableName,userIds,date,isMonthly,egoNetwork,showName,weight,runPressed)
      setUpdateTrigger(false);
    }
    if(runPressed) {
      setRunPressed(false)
    }

    async function fetchData(tableName:string,
                            userIds:string, 
                            date:string, 
                            isMonthly:boolean,
                            egoNetwork:boolean,
                            showName:boolean,
                            weight: string,
                            runPressed: boolean) {
      try {
        if((userIds.length== 0)|| (date.length==0)){
          return
        }
        setLoading(true); // Start loading indicator when API call begins
        let dateParam = isMonthly?`date=${date}-01` : `date=${date}`;
        let query = `${tableName}?${dateParam}&userids=${userIds.replace(/\s/g, '')}`;
        if(weight.length > 0) {
          query+= `&weight=${weight}`
        }
        if(egoNetwork){
          query+= `&egonet=on`
        } else {
          query+= `&egonet=off`
        }
        query+= `&showname=${showName}`
        query+= `&email=${email}`
        query+= `&urllaunch=${!runPressed}`
        const apiUrl = `https://dena-pococha-ns-dev-gcp.an.r.appspot.com/api/data/${query}`;
        console.log('Url :'+ apiUrl)
        const response = await fetch(apiUrl);
        
        setLoading(false); // Stop loading indicator when API call completes
        if (!response.ok) {
          throw new Error('Failed to fetch data from the server');
        }
        const serverData: ServerResponseItem[] = await response.json();
        const transformedData = transformResponse(serverData, new Date(date),showName, userIds); 
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
    

    function addNetwork(containerId: string, networkInstance: vis.Network) {
      setNetworks((prevNetworks) => ({
        ...prevNetworks,
        [containerId]: networkInstance,
      }));
    }
    function drawGraph(containerId: string, nodes: Node[], edges: Edge[], timeFrame: string) {
      let allNodes: Record<string, vis.Node>;
      let _allEdges: Record<string, vis.Edge>;
      let nodeColors: Record<string, Color>;
      let network: vis.Network;
      let options: vis.Options;
      let data: vis.Data;
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
        nodes: {
          shape: "dot",
          size: 16,
          borderWidthSelected: 5,
        },
        edges: {
          arrowStrikethrough: true,
          color: {
            inherit: false,
            color: "#727272",
            opacity: 0.3,
            highlight: "FF0000"
          }
        },
        layout: { randomSeed: 50 },
        physics: {
          forceAtlas2Based: {
            gravitationalConstant: -26,
            centralGravity: 0.005,
            springLength: 230,
            springConstant: 0.18,
            avoidOverlap: 0
          },
          repulsion: {
            springConstant: 100,
            damping: 100
          },
          maxVelocity: 146,
          solver: "forceAtlas2Based",
          timestep: 0.35,
          stabilization: { iterations: 500 }
        },        
      };
      

      //options.configure.container = document.getElementById('config');
      
      network = new vis.Network(container, data, options);
      containerToNetworkMap.push({ containerId: container.id, network: network });
      network.on("select", function (params) {
        var selectedNodeId = params.nodes[0];
        setSelectedNodeId(selectedNodeId)
        const containerId = 
        containerToNetworkMap.find((item) => item.network === network)?.containerId;
        const url = `https://ope.pococha.com/users/${selectedNodeId}`;
        if(containerId) {
          const containerElement = document.getElementById(containerId)?.parentElement?.parentElement;
          if (containerElement) {
            let urlElement = containerElement.querySelector('.user-url-element') as HTMLAnchorElement | null;

            if (!urlElement) {
              urlElement = document.createElement('a');
              urlElement.href = url;
              urlElement.target = '_blank';
              urlElement.textContent = `Ope Link for user ID ${selectedNodeId}`;
              urlElement.classList.add('user-url-element'); 
              const h3Element = containerElement.querySelector('h3');
              if (h3Element) {
                h3Element.insertAdjacentElement('afterend', urlElement);
              }
            } else {
              // If the URL element already exists, update its href attribute
              urlElement.href = url;
              urlElement.textContent = `Ope Link for user ID ${selectedNodeId}`;
            }          
          }
        }
    });
      network.on("stabilizationIterationsDone", function () {
        network.stopSimulation();
      });
      
      network.once('afterDrawing', () => {
        console.log("Drawing completed")
        const h3Element = container.parentElement?.parentElement?.querySelector('h3');

        if (h3Element) {
          h3Element.textContent = timeFrame;
        }
      });
      
      // Set the <h3> header to the timeFrame string
      const h3Element = container.parentElement?.parentElement?.querySelector('h3');
      if (h3Element) {
        h3Element.textContent = timeFrame + " ( now drawing...)";
      }
      addNetwork(containerId,network)
      
      return network;
    }
  }, [email,updateTrigger,JSON.stringify(router.query)]);

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
            <InputLabel style={{ fontSize: 10}}>Enter user IDs separated by comma (Max input 100)</InputLabel>
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
          <Box style={{ width: 180, marginRight: '8px',marginTop: '14px'}}>
          <Tooltip title="Select user ID" arrow>
            <Button
              variant="contained"
              color="primary"
              style={{ height: 30, width: 162, marginLeft: '8px'}}
              onClick={handleOpenModalGetLinks}>
              Select from list
            </Button>
          </Tooltip>
          </Box>
          <Box style={{ display: 'flex', alignItems: 'center', marginLeft: '0px',marginRight: '8px',marginTop: '16px'}}>
            <Checkbox
              checked={showName}
              onChange={handleShowNameChange}
              color="primary" // Customize the color if needed
              inputProps={{ 'aria-label': 'Show Name Checkbox' }} // Aria label for accessibility
            />
            <InputLabel style={{ fontSize: 10 }}>Show Name</InputLabel>
          </Box>
          <Divider orientation="vertical" flexItem/>
          <Box style={{ width: 108,  marginLeft: '8px' }}>
            <InputLabel style={{ fontSize: 10}}>Edge Types</InputLabel>
            <Select style={{ fontSize: 10, height:30, width: 100}} value={selectedType} onChange={handleParamChange}>
            <MenuItem className={classes.menuItem} value="Core Fan">Core Fan</MenuItem>
            <MenuItem className={classes.menuItem} value="Coin Usage">Coin Usage</MenuItem>
            <MenuItem className={classes.menuItem} value="Item Usage">Item Usage</MenuItem>
            <MenuItem className={classes.menuItem} value="Paid Coins">Paid Coins</MenuItem>
            </Select>
          </Box>
          <Box style={{ width: 128,marginTop: '16px',marginLeft: '8px', marginRight: '8px', display: 'flex', alignItems: 'center' }}>
            <Typography style={{ fontSize: 10, color: !isMonthly ? 'blue' : 'initial', cursor: 'pointer' }} onClick={() => handleSwitchChange()}>Weekly</Typography>
            <Switch
              checked={isMonthly}
              onChange={handleSwitchChange}
            />
            <Typography style={{ fontSize: 10, color: !isMonthly ? 'initial' : 'blue', cursor: 'pointer' }} onClick={() => handleSwitchChange()}>Monthly</Typography>
          </Box>
          <Box style={{ width: 160, marginRight: '8px'}}>
            <InputLabel style={{ fontSize: 10}}>Visualization period</InputLabel>
            <TextField
              InputProps={{
                style: { fontSize: 10, height: '30px' },
                className: dateError ? 'shake-animation' : '', // Apply animation class
              }}
              style={{ width: '100%' }}
              type={isMonthly? "month" : "date"}
              value={date}
              onChange={handleDateChange}
              error={dateError} // Apply error style
            />
          </Box>

          <Box style={{ width: 80, marginRight: '8px'}}>
            <InputLabel style={{ fontSize: 10}}>Edge Threshold</InputLabel>
            <TextField
              InputProps={{
                style: { fontSize: 10, height: '30px' },
              }}
              style={{ width: '100%' }}
              value={weight}
              onChange={handleWeightChange}
            />
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box style={{ width: 128, marginLeft: '8px', marginRight: '16px',display: 'flex', alignItems: 'center' }}>
            <Typography style={{ fontSize: 10, color: !egoNetwork ? 'blue' : 'initial', cursor: 'pointer' }} onClick={() => handleEgoNetworkChange()}>Ego Network Off</Typography>
            <Switch
            checked={egoNetwork}
            onChange={handleEgoNetworkChange}
            />
          <Typography style={{ fontSize: 10, color: !egoNetwork ? 'initial' : 'blue', cursor: 'pointer' }} onClick={() => handleEgoNetworkChange()}>Ego Network On</Typography>
          </Box>
          
          <Divider orientation="vertical" flexItem />
          <Grid container spacing={2}>
            <Grid item>
              <Grid container direction="column" alignItems="center">
                <Tooltip title="Plot graphs below" arrow>
                  <IconButton color="primary" onClick={handleRunClick} 
                  ref={runButtonRef}>
                    <PlayArrowIcon fontSize="large" />
                  </IconButton>
                </Tooltip>
                <Typography align="center" variant="caption">Run</Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container direction="column" alignItems="center">
                <Tooltip title="Download all graphs as PNG" arrow>
                  <IconButton color="primary" onClick={captureAndSaveImage}>
                    <GetAppIcon fontSize="large" />
                  </IconButton>
                </Tooltip>
                <Typography align="center" variant="caption">Download</Typography>
              </Grid>
            </Grid>
          </Grid>
        </div>
        <Divider />
        <ModalLists open={isModalGetLinksOpen} 
        onClose={handleCloseModalGetLinks} 
        openAddLinksModal={openAddLinksModal} 
        refreshLinks={refreshLinksList}/>

        <ModalAddLinks open={isModalAddLinksOpen} 
        onClose={handleCloseModalAddLinks} 
        onLinkSaved={refreshLinksList} 
        isUserList={isUserList}
        />
      </div>
      {loading ? (
        <Grid container className={classes.progressContainer}>
          <CircularProgress />
        </Grid>
      ) : (
        <div className={classes.container}>
          <div id="n1">
            <div className={classes.networkHeader}>
              <h3>Date range 1</h3>
              <Box id = "b1" style={{ display: 'flex', alignItems: 'center'}}>
                <Checkbox
                  checked={showGrid}
                  onChange={handleShowGridChange}
                  color="primary"
                  inputProps={{ 'aria-label': 'Show Grid Checkbox' }}
                  />
                  <InputLabel style={{ fontSize: 12 }}>Show Grid</InputLabel>
              </Box>              
            </div>
            <div id="gridoverlay1" style={{ position: 'relative' }}>
                {showGrid && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundImage:
                        'linear-gradient(to right, black 1px, transparent 1px), linear-gradient(to bottom, black 1px, transparent 1px)',
                      backgroundSize: '30px 30px',
                      pointerEvents: 'none', // Make the overlay not clickable
                      zIndex: 1, // Ensure it's above other content
                    }}
                  >
                    {/* Add chess-like notations */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        color: 'black',
                        fontSize: 12,
                        textAlign: 'center',
                      }}
                    >
                        {/* Vertical numbers */}
                        {[...Array(19)].map((_, index) => (
                        <div
                          key={`v${index}`}
                          style={{
                            flex: '1 1 auto',
                            width: '4%', // Adjusted width for better visualization
                            textAlign: 'center',
                            color: 'black',
                            fontSize: 12,
                            marginTop: index === 0 ? '32px' : '8px', // Set top margin to 32px for the first element
                          }}
                        >
                          {index + 1}
                        </div>
                      ))}
                      {/* Horizontal alphabets */}
                      {Array.from({ length: 23 }, (_, index) => String.fromCharCode(64 + index)).map(
                        (letter, index) => (
                          <div
                            key={`h${index}`}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: `${(index / 23) * 100}%`,
                              width: '4%',
                              height: '100%',
                              textAlign: 'center',
                              color: 'black',
                              fontSize: 12,
                            }}
                          >
                            {letter}
                          </div>
                        )
                      )}                  
                    </div>
                    
                  </div>
                )}           
                <div id="mynetwork1" className={classes.box}>
                </div>
            </div>
          </div>          
          <div id="n2">
            <div className={classes.networkHeader}>
              <h3>Date range 2</h3>
              <Box id = "b1" style={{ display: 'flex', alignItems: 'center'}}>
                <Checkbox
                  checked={showGrid2}
                  onChange={handleShowGridChange2}
                  color="primary"
                  inputProps={{ 'aria-label': 'Show Grid Checkbox' }}
                  />
                  <InputLabel style={{ fontSize: 12 }}>Show Grid</InputLabel>
              </Box>              
            </div>
            <div id="gridoverlay1" style={{ position: 'relative' }}>
                {showGrid2 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundImage:
                        'linear-gradient(to right, black 1px, transparent 1px), linear-gradient(to bottom, black 1px, transparent 1px)',
                      backgroundSize: '30px 30px',
                      pointerEvents: 'none', // Make the overlay not clickable
                      zIndex: 1, // Ensure it's above other content
                    }}
                  >
                    {/* Add chess-like notations */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        color: 'black',
                        fontSize: 12,
                        textAlign: 'center',
                      }}
                    >
                        {/* Vertical numbers */}
                        {[...Array(19)].map((_, index) => (
                        <div
                          key={`v${index}`}
                          style={{
                            flex: '1 1 auto',
                            width: '4%', // Adjusted width for better visualization
                            textAlign: 'center',
                            color: 'black',
                            fontSize: 12,
                            marginTop: index === 0 ? '32px' : '8px', // Set top margin to 32px for the first element
                          }}
                        >
                          {index + 1}
                        </div>
                      ))}
                      {/* Horizontal alphabets */}
                      {Array.from({ length: 23 }, (_, index) => String.fromCharCode(64 + index)).map(
                        (letter, index) => (
                          <div
                            key={`h${index}`}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: `${(index / 23) * 100}%`,
                              width: '4%',
                              height: '100%',
                              textAlign: 'center',
                              color: 'black',
                              fontSize: 12,
                            }}
                          >
                            {letter}
                          </div>
                        )
                      )}                  
                    </div>
                    
                  </div>
                )}           
                <div id="mynetwork2" className={classes.box}>
                </div>
            </div>
          </div>          
          <div id="n3">
            <div className={classes.networkHeader}>
              <h3>Date range 3</h3>
              <Box id = "b1" style={{ display: 'flex', alignItems: 'center'}}>
                <Checkbox
                  checked={showGrid3}
                  onChange={handleShowGridChange3}
                  color="primary"
                  inputProps={{ 'aria-label': 'Show Grid Checkbox' }}
                  />
                  <InputLabel style={{ fontSize: 12 }}>Show Grid</InputLabel>
              </Box>              
            </div>
            <div id="gridoverlay1" style={{ position: 'relative' }}>
                {showGrid3 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundImage:
                        'linear-gradient(to right, black 1px, transparent 1px), linear-gradient(to bottom, black 1px, transparent 1px)',
                      backgroundSize: '30px 30px',
                      pointerEvents: 'none', // Make the overlay not clickable
                      zIndex: 1, // Ensure it's above other content
                    }}
                  >
                    {/* Add chess-like notations */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        color: 'black',
                        fontSize: 12,
                        textAlign: 'center',
                      }}
                    >
                        {/* Vertical numbers */}
                        {[...Array(19)].map((_, index) => (
                        <div
                          key={`v${index}`}
                          style={{
                            flex: '1 1 auto',
                            width: '4%', // Adjusted width for better visualization
                            textAlign: 'center',
                            color: 'black',
                            fontSize: 12,
                            marginTop: index === 0 ? '32px' : '8px', // Set top margin to 32px for the first element
                          }}
                        >
                          {index + 1}
                        </div>
                      ))}
                      {/* Horizontal alphabets */}
                      {Array.from({ length: 23 }, (_, index) => String.fromCharCode(64 + index)).map(
                        (letter, index) => (
                          <div
                            key={`h${index}`}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: `${(index / 23) * 100}%`,
                              width: '4%',
                              height: '100%',
                              textAlign: 'center',
                              color: 'black',
                              fontSize: 12,
                            }}
                          >
                            {letter}
                          </div>
                        )
                      )}                  
                    </div>
                    
                  </div>
                )}           
                <div id="mynetwork3" className={classes.box}>
                </div>
            </div>
          </div>          
          <div id="n4">
            <div className={classes.networkHeader}>
              <h3>Date range 4</h3>
              <Box id = "b1" style={{ display: 'flex', alignItems: 'center'}}>
                <Checkbox
                  checked={showGrid4}
                  onChange={handleShowGridChange4}
                  color="primary"
                  inputProps={{ 'aria-label': 'Show Grid Checkbox' }}
                  />
                  <InputLabel style={{ fontSize: 12 }}>Show Grid</InputLabel>
              </Box>              
            </div>
            <div id="gridoverlay1" style={{ position: 'relative' }}>
                {showGrid4 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundImage:
                        'linear-gradient(to right, black 1px, transparent 1px), linear-gradient(to bottom, black 1px, transparent 1px)',
                      backgroundSize: '30px 30px',
                      pointerEvents: 'none', // Make the overlay not clickable
                      zIndex: 1, // Ensure it's above other content
                    }}
                  >
                    {/* Add chess-like notations */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        color: 'black',
                        fontSize: 12,
                        textAlign: 'center',
                      }}
                    >
                        {/* Vertical numbers */}
                        {[...Array(19)].map((_, index) => (
                        <div
                          key={`v${index}`}
                          style={{
                            flex: '1 1 auto',
                            width: '4%', // Adjusted width for better visualization
                            textAlign: 'center',
                            color: 'black',
                            fontSize: 12,
                            marginTop: index === 0 ? '32px' : '8px', // Set top margin to 32px for the first element
                          }}
                        >
                          {index + 1}
                        </div>
                      ))}
                      {/* Horizontal alphabets */}
                      {Array.from({ length: 23 }, (_, index) => String.fromCharCode(64 + index)).map(
                        (letter, index) => (
                          <div
                            key={`h${index}`}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: `${(index / 23) * 100}%`,
                              width: '4%',
                              height: '100%',
                              textAlign: 'center',
                              color: 'black',
                              fontSize: 12,
                            }}
                          >
                            {letter}
                          </div>
                        )
                      )}                  
                    </div>
                    
                  </div>
                )}           
                <div id="mynetwork4" className={classes.box}>
                </div>
            </div>
          </div>          
          <div id="n5">
            <div className={classes.networkHeader}>
              <h3>Date range 5</h3>
              <Box id = "b1" style={{ display: 'flex', alignItems: 'center'}}>
                <Checkbox
                  checked={showGrid5}
                  onChange={handleShowGridChange5}
                  color="primary"
                  inputProps={{ 'aria-label': 'Show Grid Checkbox' }}
                  />
                  <InputLabel style={{ fontSize: 12 }}>Show Grid</InputLabel>
              </Box>              
            </div>
            <div id="gridoverlay1" style={{ position: 'relative' }}>
                {showGrid5 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundImage:
                        'linear-gradient(to right, rgba(0, 0, 0, 0.9) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.9) 1px, transparent 1px)',
                      backgroundSize: '30px 30px',
                      pointerEvents: 'none', // Make the overlay not clickable
                      zIndex: 1, // Ensure it's above other content
                    }}
                  >
                    {/* Add chess-like notations */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        color: 'black',
                        fontSize: 12,
                        textAlign: 'center',
                      }}
                    >
                        {/* Vertical numbers */}
                        {[...Array(19)].map((_, index) => (
                        <div
                          key={`v${index}`}
                          style={{
                            flex: '1 1 auto',
                            width: '4%', // Adjusted width for better visualization
                            textAlign: 'center',
                            color: 'black',
                            fontSize: 12,
                            marginTop: index === 0 ? '32px' : '8px', // Set top margin to 32px for the first element
                          }}
                        >
                          {index + 1}
                        </div>
                      ))}
                      {/* Horizontal alphabets */}
                      {Array.from({ length: 23 }, (_, index) => String.fromCharCode(64 + index)).map(
                        (letter, index) => (
                          <div
                            key={`h${index}`}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: `${(index / 23) * 100}%`,
                              width: '4%',
                              height: '100%',
                              textAlign: 'center',
                              color: 'black',
                              fontSize: 12,
                            }}
                          >
                            {letter}
                          </div>
                        )
                      )}                  
                    </div>
                    
                  </div>
                )}           
                <div id="mynetwork5" className={classes.box}>
                </div>
            </div>
          </div>          
          <div id="n6">
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
