import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  VStack,
  Text,
  HStack,
  useToast,
  FlatList,
  Center,
  Spinner,
} from 'native-base';
import { useColorModeValue } from '../components/ColorModeContext';
import { TouchableOpacity } from 'react-native';

const Menu = ({ navigation }) => {
  const { mode } = useColorModeValue();
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortedBy, setSortedBy] = useState('pontuacao');
  const [sortOrder, setSortOrder] = useState('desc');
  const toast = useToast();

  useEffect(() => {
    fetchAlunosComPontuacao();
  }, []);

  const fetchAlunosComPontuacao = async () => {
    setLoading(true);
    try {
      const [respostaResponse, alunosResponse] = await Promise.all([
        fetch('https://somenteapigame.azurewebsites.net/api/resposta'),
        fetch('https://somenteapialuno.azurewebsites.net/alunos/'),
      ]);

      if (!respostaResponse.ok || !alunosResponse.ok) {
        throw new Error('Erro ao carregar dados');
      }

      const respostaData = await respostaResponse.json();
      const alunosData = await alunosResponse.json();

      const alunoPontuacao = respostaData.reduce((acc, resposta) => {
        const { alunoId, answer } = resposta;
        if (!acc[alunoId]) {
          acc[alunoId] = 0;
        }
        acc[alunoId] += Number(answer);
        return acc;
      }, {});

      const alunosComPontuacao = alunosData.map(aluno => ({
        ...aluno,
        pontuacao: alunoPontuacao[aluno.id] || 0,
      }));

      setAlunos(alunosComPontuacao);
    } catch (error) {
      toast.show({ description: 'Erro ao carregar alunos e pontuações' });
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column) => {
    const newSortOrder = sortedBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortedBy(column);
    setSortOrder(newSortOrder);

    const sortedAlunos = [...alunos].sort((a, b) => {
      if (a[column] < b[column]) return newSortOrder === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return newSortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    setAlunos(sortedAlunos);
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
        <Button onPress={() => navigation.navigate('Professor', { fromLogin: false })}>Professor</Button>
        <Button onPress={() => navigation.navigate('Aluno')}>Aluno</Button>
        <Button onPress={() => navigation.navigate('Pergunta_Resposta')}>Perguntas e Respostas</Button>
        <Button onPress={fetchAlunosComPontuacao}>Atualizar tabela</Button>
      </VStack>

      <Center width="100%">
        {loading ? (
          <Spinner accessibilityLabel="Carregando dados" />
        ) : (
          <Box width="100%" maxW="800px" mt={8}>
            <HStack justifyContent="space-between" mb={4}>
              <TouchableOpacity onPress={() => handleSort('id')}>
                <Text fontWeight="bold">ID {sortedBy === 'id' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSort('nome')}>
                <Text fontWeight="bold">Nome {sortedBy === 'nome' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSort('email')}>
                <Text fontWeight="bold">Email {sortedBy === 'email' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSort('pontuacao')}>
                <Text fontWeight="bold">Pontuação {sortedBy === 'pontuacao' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSort('turma')}>
                <Text fontWeight="bold">Turma {sortedBy === 'turma' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</Text>
              </TouchableOpacity>
            </HStack>
            <FlatList
              data={alunos}
              renderItem={({ item }) => (
                <HStack justifyContent="space-between" py={2} borderBottomWidth={1} borderBottomColor="coolGray.300">
                  <Text>{item.id}</Text>
                  <Text>{item.nome}</Text>
                  <Text>{item.email}</Text>
                  <Text>{item.pontuacao}</Text>
                  <Text>{item.turma}</Text>
                </HStack>
              )}
              keyExtractor={(item) => String(item.id)}
            />
          </Box>
        )}
      </Center>
    </Box>
  );
};

export default Menu;
