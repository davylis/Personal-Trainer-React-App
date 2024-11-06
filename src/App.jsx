import Customerlist from "./components/Customerlist";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline'

function App() {
  return (
    <Container maxwidth="xl">
          <CssBaseline />
    <AppBar position='static'>
      <Toolbar>
        <Typography variant = 'h6'>Personal Trainer App</Typography>
      </Toolbar>
      </AppBar>
      <Customerlist />
    </Container>
  )
}

export default App
