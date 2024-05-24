import { useState, useEffect, useRef } from "react";
import { Box, Button, Container, HStack, Input, VStack } from "@chakra-ui/react";
import Message from "./components/Message";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebase";
import { getFirestore, addDoc, collection, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore";
import "./app.css"


const auth = getAuth(app);
const db = getFirestore(app);

const loginHandler = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
  }
};

const logoutHandler = async () => {
  try {
    await signOut(auth);
  } catch (error) {
  }
};



function App() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const divforscrool = useRef(null)

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!message) return;
    try {
      await addDoc(collection(db, "Messages"), {
        text: message,
        uid: user.uid,
        uri: user.photoURL,
        createdAt: serverTimestamp(),
      });
      setMessage("");
      divforscrool.current.scrollIntoView({ behaviour: "smooth" })
    } catch (error) {
      alert("Error ", error);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "Messages"), orderBy("createdAt", "asc"));

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => {
        const id = doc.id;
        return { id, ...doc.data() };
      }));
    });

    return () => {
      unsubscribeAuth();
      unsubscribeMessages();
    };
  }, []);

  return (
    <Box bg={"red.50"}>
      {user ? (
        <Container bg={"white"} h={"100vh"} padding={"2"}>
          <VStack h="full">
            <Button w="full" colorScheme={"red"} onClick={logoutHandler}>
              SIGN OUT!
            </Button>
            <VStack h="full" w={"full"} overflowY={"auto"} paddingY={"10"}  >
              {messages.map((item) => (
                <Message
                  key={item.id}
                  user={item.uid === user.uid ? "me" : "other"}
                  text={item.text}
                  uri={item.uri}
                />
              ))}
              <div ref={divforscrool} ></div>
            </VStack>
            <form style={{ width: "100%" }} onSubmit={submitHandler}>
              <HStack>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter Content here..."
                />
                <Button type="submit" colorScheme={"purple"}>
                  Submit
                </Button>
              </HStack>
            </form>
          </VStack>
        </Container>
      ) : (
        <VStack h={"100vh"} justifyContent={"center"} alignItems={"center"} bg={"white"}>
          <Button colorScheme={"purple"} onClick={loginHandler}>
            Sign in with Google
          </Button>
        </VStack>
      )}
    </Box>
  );
}

export default App;
