import React, { useState, ChangeEvent } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import LinearProgress from '@mui/material/LinearProgress';

interface ModalAddLinksProps {
  open: boolean;
  onClose: () => void;
  onLinkSaved: () => void;
  isUserList: boolean;
}

interface LinkData {
  title: string;
  url: string;
}
interface UserIdData {
  title: string;
  userids: string;
}

const ModalAddLinks: React.FC<ModalAddLinksProps> = ({ open, onClose, onLinkSaved, isUserList }) => {
  const [linkName, setLinkName] = useState('');
  const [url, setUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddLink = async () => {
    if (linkName && url) {
      try {
        setIsSaving(true);

        const linkData: LinkData = {
          title: linkName,
          url: url,
        };
        const userIdData: UserIdData = {
          title: linkName,
          userids: url,
        };

        const apiUrl = isUserList
          ? 'https://dena-pococha-ns-dev-gcp.an.r.appspot.com/api/saveUserIds'
          : 'https://dena-pococha-ns-dev-gcp.an.r.appspot.com/api/saveLink';

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(isUserList?userIdData:linkData),
        });

        // Handle response as needed
        const data = await response.json();
        console.log('Add Link API Response:', data);

        setIsSaving(false);
        // Close the modal
        onClose();
        setLinkName('');
        setUrl('');
        onLinkSaved();
      } catch (error) {
        console.error('Error adding link:', error);
        setIsSaving(false);
      }
    }
  };

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
          width: 500,
          bgcolor: 'white',
          borderRadius: '8px',
          boxShadow: 24,
          p: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" id="modal-title" gutterBottom sx={{ textAlign: 'left' }}>
          {isUserList ? 'Enter User ID details' : 'Enter Url details'}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box>
          <Typography id="modal-description" gutterBottom>
            <input
              type="text"
              placeholder={'title'}
              value={linkName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setLinkName(e.target.value)}
              style={{ width: 'calc(100% - 8px)', marginRight: 2 }}
            />
          </Typography>
          <Typography id="modal-description" gutterBottom>
            <input
              type="text"
              placeholder={isUserList ? 'Enter user ids separated by comma' : 'URL'}
              value={url}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
              style={{ width: 'calc(100% - 8px)', marginRight: 2 }}
            />
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            {isSaving && <LinearProgress sx={{ width: '70%', mt: 2, marginRight: 2 }} />}
            <Button variant="contained" onClick={handleAddLink}>
              Save {isUserList ? 'User ID list' : 'Url'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalAddLinks;
