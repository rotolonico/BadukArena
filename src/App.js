import AuthComponent from "./AuthComponent";
import ChatComponent from "./ChatComponent";
import  { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container, AppBar, Toolbar, Typography, Button} from "@mui/material";

function App() {
  return (<Router>
          <Container>
              <AppBar position="static">
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Baduk Arena
                </Typography>
                <Button color="inherit" href="/auth">Login</Button>
                <Button color="inherit" href="/chat">Chat</Button>
              </Toolbar>
            </AppBar>
              <Routes>
                <Route path="/auth" element={<AuthComponent />} />
                <Route path="/chat" element={<ChatComponent />} />
              </Routes>
            </Container>
      </Router>
  );
};

export default App;
