import React from 'react';
import {
  Box,
  Text,
  VStack,
  Input,
  Button,
  HStack,
  Switch,
  NativeBaseProvider,
} from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Menu from './components/Menu';
import Professor from './components/Professor';
import Aluno from './components/Aluno';
import Pergunta_Resposta from './components/Pergunta_Resposta';
import { ColorModeProvider, useColorModeValue } from './components/ColorModeContext';

const Stack = createNativeStackNavigator();

const LoginScreen = ({ navigation }) => {
  const { mode, toggleMode } = useColorModeValue();

  return (
    <Box
      bg={mode === "light" ? "coolGray.50" : "coolGray.900"}
      minHeight="100vh"
      justifyContent="center"
      alignItems="center"
      px={4}
    >
      <VStack space={4} width="80%" maxW="300px">
        <HStack space={2}>
          <Text>Modo Noturno</Text>
          <Switch
            isChecked={mode === "light"}
            onToggle={toggleMode}
            accessibilityLabel={
              mode === "light" ? "switch to dark mode" : "switch to light mode"
            }
          />
          <Text>Modo Claro</Text>
        </HStack>
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">Login</Text>
        <VStack space={2} width="100%">
          <Text>Email</Text>
          <Input placeholder="Email" keyboardType="email-address" />
        </VStack>
        <VStack space={2} width="100%">
          <Text>Senha</Text>
          <Input placeholder="Senha" type="password" />
        </VStack>
        <Button onPress={() => navigation.navigate('Menu')}>Login</Button>
        <Button variant="link" onPress={() => navigation.navigate('Professor', { fromLogin: true })}>Cadastro</Button>
        <Button variant="link" onPress={() => alert('Redefinir senha')}>Esqueci minha senha</Button>
      </VStack>
    </Box>
  );
};

const App = () => {
  return (
    <NativeBaseProvider>
      <ColorModeProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Menu" component={Menu} />
            <Stack.Screen name="Professor" component={Professor} />
            <Stack.Screen name="Aluno" component={Aluno} />
            <Stack.Screen name="Pergunta_Resposta" component={Pergunta_Resposta} />
          </Stack.Navigator>
        </NavigationContainer>
      </ColorModeProvider>
    </NativeBaseProvider>
  );
};

export default App;
