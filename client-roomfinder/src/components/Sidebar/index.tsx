import React, { useState } from 'react';
import { Drawer, Button } from '@mui/material';

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <div>
      <Button onClick={toggleDrawer}>Abrir Sidebar</Button>
      <Drawer open={open} onClose={toggleDrawer}>
        <div>Contenido del Sidebar</div>
      </Drawer>
    </div>
  );
};

export default Sidebar;
