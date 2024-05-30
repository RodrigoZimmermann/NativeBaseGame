import React from 'react';
import { Box, Button, VStack } from 'native-base';
import { useColorModeValue } from '../components/ColorModeContext';

const Menu = ({ navigation }) => {
  const { mode } = useColorModeValue();

  return (
    <Box
      bg={mode === "light" ? "coolGray.50" : "coolGray.900"}
      minHeight="100vh"
      justifyContent="center"
      alignItems="center"
      px={4}
    >
      <VStack space={4} width="80%" maxW="300px">
        <Button onPress={() => navigation.navigate('Professor', { fromLogin: false })}>Professor</Button>
        <Button onPress={() => navigation.navigate('Aluno')}>Aluno</Button>
        <Button onPress={() => navigation.navigate('Pergunta_Resposta')}>Perguntas e Respostas</Button>
      </VStack>
    </Box>
  );
};

export default Menu;
