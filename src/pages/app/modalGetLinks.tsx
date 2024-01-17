import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CloseIcon from '@mui/icons-material/Close';

interface ModalListProps {
  open: boolean;
  onClose: (userIdList: string) => void;
  openAddLinksModal: (isUserList: boolean) => void;
  refreshLinks: () => void;
}

interface Link {
  title: string;
  url: string;
}

const ModalLists: React.FC<ModalListProps> = ({ open, onClose, openAddLinksModal, refreshLinks }) => {
  const [links, setLinks] = useState<Link[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);

  const getLinks = async (url: string) => {
    try {
      const response = await fetch(url);
      const data: Link[] = await response.json();
      setLinks(data);
    } catch (error) {
      console.error('Error fetching links:', error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newTab: number) => {
    setActiveTab(newTab);
    if (newTab === 0) {
      getLinks('https://dena-pococha-ns-dev-gcp.an.r.appspot.com/api/getLinks');
    } else {
      getLinks('https://dena-pococha-ns-dev-gcp.an.r.appspot.com/api/getUserIds');
    }
  };
  const handleUserIdsClick = (userIds: string) => {
    if (activeTab === 1) {
      onClose(userIds)
    } else {
      window.open(userIds, '_blank');
    }
  };
  useEffect(() => {
    if (open) {
      handleTabChange(null as any, activeTab); // Trigger initial tab content fetch
    }
  }, [open, refreshLinks]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'white',
          borderRadius: '8px',
          boxShadow: 24,
          p: 0,
          maxHeight: '80vh', // Set maximum height for the modal
        }}
      >
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: '16px',
            borderTopLeftRadius: '7px',
            borderTopRightRadius: '7px',
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            {activeTab === 0 ? 'Argus/Ope Urls' : 'User Id List'}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => onClose('')}
            sx={{
              color: 'primary.contrastText',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          centered
        >
          <Tab label="Argus/OPE Urls" />
          <Tab label="User Id List" />
        </Tabs>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '16px',
            px: 2,
          }}
        >
          <Typography id="modal-description">
            {activeTab === 0
              ? 'ℹ️ Please connect to VPN before clicking'
              : 'ℹ️ Click any item below to auto input user ids'}
          </Typography>
          <Button variant="contained" onClick={() => openAddLinksModal(activeTab === 1)}>
            {activeTab === 0 ? 'Add new Url' : 'Add new user ID'}
          </Button>
        </Box>
        <ul
          style={{
            overflowY: 'auto', // Enable vertical scrolling
            maxHeight: 'calc(80vh - 112px)', // Adjust maximum height based on other elements
          }}
        >
          {links.map((link, index) => (
            <li key={index}>
              <Button
                component="a"
              
                rel="noopener noreferrer"
                sx={{ textTransform: 'none' }}
                onClick={() => handleUserIdsClick(link.url)}
              >
                {link.title}
              </Button>
            </li>
          ))}
        </ul>
      </Box>
    </Modal>
  );
};

export default ModalLists;
