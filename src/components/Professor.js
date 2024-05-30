import React, { useState } from 'react';
import {
  Box,
  Text,
  VStack,
  Input,
  Button,
  HStack,
  useToast,
} from 'native-base';
import { useColorModeValue } from '../components/ColorModeContext';

const Professor = ({ route, navigation }) => {
  const { mode } = useColorModeValue();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [turma, setTurma] = useState('');
  const [showConfirmButtons, setShowConfirmButtons] = useState(false);
  const toast = useToast();
  const { fromLogin } = route.params;

  const handleAdd = () => {
    // Lógica para adicionar professor
    toast.show({ description: 'Professor adicionado com sucesso!' });
    setNome('');
    setEmail('');
    setSenha('');
    setTurma('');
  };

  const handleUpdate = () => {
    // Lógica para atualizar professor
    toast.show({ description: 'Professor atualizado com sucesso!' });
    setNome('');
    setEmail('');
    setSenha('');
    setTurma('');
  };

  const handleDelete = () => {
    // Lógica para deletar professor
    toast.show({ description: 'Professor deletado com sucesso!' });
    setNome('');
    setEmail('');
    setSenha('');
    setTurma('');
  };

  return (
    <Box
      bg={mode === "light" ? "coolGray.50" : "coolGray.900"}
      minHeight="100vh"
      justifyContent="center"
      alignItems="center"
      px={4}
    >
      {!fromLogin && (
        <Button onPress={() => navigation.navigate('Menu')}>Voltar ao Menu</Button>
      )}
      <VStack space={4} width="80%" maxW="300px">
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">Cadastro de Professor</Text>
        <VStack space={2} width="100%">
          <Text>Nome</Text>
          <Input placeholder="Nome" value={nome} onChangeText={setNome} />
        </VStack>
        <VStack space={2} width="100%">
          <Text>Email</Text>
          <Input placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        </VStack>
        <VStack space={2} width="100%">
          <Text>Senha</Text>
          <Input placeholder="Senha" value={senha} onChangeText={setSenha} type="password" />
        </VStack>
        <VStack space={2} width="100%">
          <Text>Turma</Text>
          <Input placeholder="Número da Turma" value={turma} onChangeText={setTurma} keyboardType="numeric" />
        </VStack>
        <HStack space={2}>
          <Button onPress={handleAdd}>Adicionar</Button>
          <Button onPress={handleUpdate}>Atualizar</Button>
          <Button onPress={() => setShowConfirmButtons(true)}>Deletar</Button>
          {showConfirmButtons && (
            <>
              <Button onPress={handleDelete}>Confirmar</Button>
              <Button onPress={() => setShowConfirmButtons(false)}>Cancelar</Button>
            </>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};

export default Professor;
