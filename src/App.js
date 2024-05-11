import logo from "./jogo.png";
import {
  Box,
  Image,
  Text,
  HStack,
  Heading,
  Switch,
  useColorMode,
  VStack,
} from "native-base";
import CRUD from "./CRUD";

function App() {
  const { colorMode } = useColorMode();

  return (
    <Box
      bg={colorMode === "light" ? "coolGray.50" : "coolGray.900"}
      minHeight="100vh"
      justifyContent="center"
      px={4}
    >
      <VStack space={2} alignItems="center">
        <Image
          source={{ uri: logo }}
          resizeMode="contain"
          size={300}
        />
        <Heading size="lg">Bem vindo ao menu</Heading>
        <ToggleDarkMode />
        <Heading size="lg"> Cadastro de perguntas</Heading>
        <CRUD />
      </VStack>
    </Box>
  );
}

function ToggleDarkMode() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <HStack space={2}>
      <Text>Modo Noturno</Text>
      <Switch
        isChecked={colorMode === "light"}
        onToggle={toggleColorMode}
        accessibilityLabel={
          colorMode === "light" ? "switch to dark mode" : "switch to light mode"
        }
      />
      <Text>Modo Claro</Text>
    </HStack>
  );
}

export default App;
