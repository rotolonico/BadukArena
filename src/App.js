import Login from "./pages/Login";
import ChatComponent from "./components/ChatComponent";
import Play from "./pages/Play";
import  { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container, AppBar, Toolbar, Typography, Button} from "@mui/material";
import GameComponent from "./components/GameComponent";

function App() {
  return (<Router>
          <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <AppBar position="static">
                  <Toolbar>
                      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                          Baduk Arena
                      </Typography>
                      <Button color="inherit" href="/auth">
                          Login
                      </Button>
                      <Button color="inherit" href="/chat">
                          Chat
                      </Button>
                      <Button color="inherit" href="/game">
                          Game
                      </Button>
                      <Button color="inherit" href="/play">
                          Play
                      </Button>
                  </Toolbar>
              </AppBar>
              <Container sx={{ flexGrow: 1, marginTop: '64px' }}>
                  <Routes>
                      <Route path="/auth" element={<Login />} />
                      <Route path="/chat" element={<ChatComponent />} />
                      <Route path="/game" element={<GameComponent />} />
                      <Route path="/play" element={<Play />} />
                  </Routes>
              </Container>
          </div>
      </Router>
  );
};

export default App;
