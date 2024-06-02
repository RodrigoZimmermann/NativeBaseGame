import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  VStack,
  Input,
  HStack,
  Text,
  FlatList,
  useToast,
  Center,
  Spinner,
} from 'native-base';
import { useColorModeValue } from '../components/ColorModeContext';

const Aluno = ({ navigation }) => {
  const { mode } = useColorModeValue();
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [turma, setTurma] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [showConfirmButtons, setShowConfirmButtons] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchAlunos();
  }, []);

  const fetchAlunos = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://somenteapialuno.azurewebsites.net/alunos');
      if (!response.ok) {
        throw new Error('Erro ao carregar alunos');
      }
      const data = await response.json();
      setAlunos(data);
    } catch (error) {
      toast.show({ description: 'Erro ao carregar alunos' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAluno = async () => {
    const data = { nome, email, senha, turma };
    try {
      await fetch('https://somenteapialuno.azurewebsites.net/alunos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      fetchAlunos();
      clearForm();
    } catch (error) {
      toast.show({ description: 'Erro ao adicionar aluno' });
    }
  };

  const handleUpdateAluno = async () => {
    const data = { nome, email, senha, turma };
    try {
      await fetch(`https://somenteapialuno.azurewebsites.net/alunos/${selectedId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      fetchAlunos();
      clearForm();
    } catch (error) {
      toast.show({ description: 'Erro ao atualizar aluno' });
    }
  };

  const handleDeleteAluno = async () => {
    try {
      await fetch(`https://somenteapialuno.azurewebsites.net/alunos/${selectedId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      fetchAlunos();
      clearForm();
      setShowConfirmButtons(false);
    } catch (error) {
      toast.show({ description: 'Erro ao deletar aluno' });
    }
  };

  const handleSelectAluno = async (id) => {
    try {
      const response = await fetch(`https://somenteapialuno.azurewebsites.net/alunos/${id}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar aluno');
      }
      const data = await response.json();
      setSelectedId(id);
      setNome(data.nome);
      setEmail(data.email);
      setSenha(data.senha);
      setTurma(data.turma);
    } catch (error) {
      toast.show({ description: 'Erro ao carregar aluno' });
    }
  };

  const clearForm = () => {
    setNome('');
    setEmail('');
    setSenha('');
    setTurma('');
    setSelectedId(null);
  };

  return (
    <Box
      bg={mode === 'light' ? 'coolGray.50' : 'coolGray.900'}
      minHeight="100vh"
      justifyContent="center"
      alignItems="center"
      px={4}
    >
      <VStack space={4} width="80%" maxW="300px">
        <Button onPress={() => navigation.navigate('Menu')} mb={4}>
          Voltar ao Menu
        </Button>
        <Text>Nome:</Text>
        <Input placeholder="Nome" value={nome} onChangeText={setNome} />
        <Text>Email:</Text>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Text>Senha:</Text>
        <Input placeholder="Senha" value={senha} onChangeText={setSenha} type="password" />
        <Text>Turma:</Text>
        <Input
          placeholder="Turma"
          value={turma}
          onChangeText={setTurma}
          keyboardType="numeric"
        />
        <HStack space={2}>
          <Button onPress={handleAddAluno}>Adicionar</Button>
          <Button onPress={handleUpdateAluno}>Atualizar</Button>
          <Button onPress={() => setShowConfirmButtons(true)}>Deletar</Button>
          {showConfirmButtons && (
            <>
              <Button colorScheme="red" onPress={handleDeleteAluno}>Confirmar</Button>
              <Button onPress={() => setShowConfirmButtons(false)}>Cancelar</Button>
            </>
          )}
        </HStack>
      </VStack>

      {loading ? (
        <Spinner accessibilityLabel="Carregando alunos" />
      ) : (
        <FlatList
          data={alunos}
          renderItem={({ item }) => (
            <Box
              p={4}
              borderWidth={1}
              borderColor={item.id === selectedId ? 'blue.500' : 'gray.200'}
              borderRadius="md"
              _even={{ backgroundColor: 'gray.100' }}
              _odd={{ backgroundColor: 'white' }}
              mb={2}
            >
              <Text fontWeight="bold">ID: {item.id}</Text>
              <Text>Nome: {item.nome}</Text>
              <Text>Email: {item.email}</Text>
              <Text>Turma: {item.turma}</Text>
              <Button onPress={() => handleSelectAluno(item.id)}>Selecionar</Button>
            </Box>
          )}
          keyExtractor={(item) => String(item.id)}
          mb={4}
        />
      )}
    </Box>
  );
};

export default Aluno;
