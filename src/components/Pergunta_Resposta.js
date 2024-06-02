import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Select,
  VStack,
  Input,
  FlatList,
  Box,
  Text,
  Spinner,
  HStack,
  useToast,
} from 'native-base';
import { useColorModeValue } from '../components/ColorModeContext';

const chemicalElements = [
  'Hidrogênio',
  'Oxigênio',
  'Hélio',
  'Neônio',
  'Argônio',
  'Criptônio',
  'Xenônio',
  'Radônio',
  'Oganessônio',
];

const Pergunta_Resposta = ({ navigation }) => {
  const { mode } = useColorModeValue();
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [text, setText] = useState('');
  const [selectedElement, setSelectedElement] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [showConfirmButtons, setShowConfirmButtons] = useState(false);
  const [alunos, setAlunos] = useState([]);
  const [selectedAluno, setSelectedAluno] = useState('');
  const toast = useToast();

  const handleValueChange = (nome) => {
    const aluno = alunos.find((aluno) => aluno.nome === nome);
    if (aluno) {
      setSelectedAluno(aluno.id);
    }
  };

  const fetchAlunos = useCallback(async () => {
    try {
      const alunosResponse = await fetch('https://somenteapialuno.azurewebsites.net/alunos/');
      if (!alunosResponse.ok) {
        throw new Error('Erro ao carregar alunos');
      }
      const alunosData = await alunosResponse.json();
      setAlunos(alunosData);
    } catch (error) {
      toast.show({ description: 'Erro ao carregar alunos' });
    }
  }, [toast]);

  const handleReloadQuestions = useCallback(async () => {
    try {
      const [perguntaResponse, respostaResponse] = await Promise.all([
        fetch('https://somenteapigame.azurewebsites.net/api/pergunta'),
        fetch('https://somenteapigame.azurewebsites.net/api/resposta'),
      ]);

      if (!perguntaResponse.ok || !respostaResponse.ok) {
        throw new Error('Erro ao carregar dados');
      }

      const perguntaData = await perguntaResponse.json();
      const respostaData = await respostaResponse.json();

      const perguntaComScore = [];
      let filteredRespostaData = [...respostaData];

      for (let i = 0; i < perguntaData.length; i++) {
      let temRegistro = false;
        const pergunta = perguntaData[i];
        for (let j = 0; j < filteredRespostaData.length; j++) {
          const resposta = filteredRespostaData[j];
          if (resposta.alunoId == selectedAluno) {
            pergunta.answer = resposta.answer;
            filteredRespostaData.splice(j, 1);  // Remove the item from the list
            perguntaComScore.push(pergunta);    // Add to the result list
            temRegistro = true;
            break;  // Exit the inner loop after the first match
          }
          filteredRespostaData.splice(j, 1);  // Remove the item from the list
        }
        if(!temRegistro){
          perguntaComScore.push(perguntaData[i]);
        }
      }
      if (perguntaComScore.length > 0) {
        setQuestions(perguntaComScore);
      } else {
        setQuestions(perguntaData);
      }
    } catch (error) {
      toast.show({ description: 'Erro ao carregar perguntas e respostas' });
    } finally {
      setLoadingQuestions(false);
    }
  }, [toast, selectedAluno]);

  useEffect(() => {
    fetchAlunos();
  }, [fetchAlunos]);

  useEffect(() => {
    handleReloadQuestions();
  }, [handleReloadQuestions, selectedAluno]);

  const handleAddQuestion = async () => {
    const data = { question: text, chemicalElement: selectedElement };
    await fetch('https://somenteapigame.azurewebsites.net/api/pergunta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    handleReloadQuestions();
    setText('');
    setSelectedElement('');
  };

  const handleUpdateQuestion = async () => {
    const data = { question: text, chemicalElement: selectedElement };
    const url = `https://somenteapigame.azurewebsites.net/api/pergunta/${selectedId}`;
    await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    handleReloadQuestions();
    setText('');
    setSelectedElement('');
    setSelectedId(null);
  };

  const handleDeleteQuestion = async () => {
    const url = `https://somenteapigame.azurewebsites.net/api/pergunta/${selectedId}`;
    await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    handleReloadQuestions();
    setShowConfirmButtons(false);
    setText('');
    setSelectedElement('');
    setSelectedId(null);
  };

  const handleSelectQuestion = (id, element, question) => {
    setSelectedId(id);
    setSelectedElement(element);
    setText(question);
  };

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => {
    if (currentPage * pageSize < questions.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const paginatedQuestions = questions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Box
      bg={mode === 'light' ? 'coolGray.50' : 'coolGray.900'}
      minHeight="100vh"
      justifyContent="center"
      alignItems="center"
      px={4}
    >
      <VStack space={4} width="80%" maxW="300px">
        <Button onPress={() => navigation.navigate('Menu')} mb={4}>Voltar ao Menu</Button>
        <Text>Aluno:</Text>
        <Select
          selectedValue={alunos.find((aluno) => aluno.id === selectedAluno)?.nome}
          minWidth={200}
          accessibilityLabel="Selecione um aluno"
          placeholder="Selecione um aluno"
          onValueChange={handleValueChange}
        >
          {alunos.map((aluno, index) => (
            <Select.Item key={index} label={aluno.nome} value={aluno.nome} />
          ))}
        </Select>
        <Text>Pergunta:</Text>
        <Input
          placeholder="Digite a pergunta"
          value={text}
          maxLength={300}
          onChangeText={setText}
        />
        <Text>Elemento Químico:</Text>
        <Select
          selectedValue={selectedElement}
          minWidth={200}
          accessibilityLabel="Selecione um elemento químico"
          placeholder="Selecione um elemento químico"
          onValueChange={setSelectedElement}
        >
          {chemicalElements.map((element, index) => (
            <Select.Item key={index} label={element} value={element} />
          ))}
        </Select>
        <HStack space={2}>
          <Button onPress={handleAddQuestion}>Adicionar</Button>
          <Button onPress={handleUpdateQuestion}>Atualizar</Button>
          <Button onPress={() => setShowConfirmButtons(true)}>Deletar</Button>
          {showConfirmButtons && (
            <>
              <Button colorScheme="red" onPress={handleDeleteQuestion}>Confirmar</Button>
              <Button onPress={() => setShowConfirmButtons(false)}>Cancelar</Button>
            </>
          )}
        </HStack>
        <Button onPress={handleReloadQuestions}>Gerar Perguntas/Respostas</Button>
      </VStack>

      {loadingQuestions ? (
        <Spinner accessibilityLabel="Carregando perguntas" />
      ) : (
        <FlatList
          data={paginatedQuestions}
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
              <Text>Pergunta: {item.question.replace(/(.{50})/g, '$1-\n')}</Text>
              <Text>Elemento Químico: {item.chemicalElement}</Text>
              <Text>{Number(item.answer) === 1 ? 'Resultado: Acertou' : Number(item.answer) === 0 ? 'Resultado: Errou' : ''}</Text>
              <Button onPress={() => handleSelectQuestion(item.id, item.chemicalElement, item.question)}>Selecionar</Button>
            </Box>
          )}
          keyExtractor={(item) => String(item.id)}
          mb={4}
        />
      )}

      <HStack space={2} justifyContent="center">
        <Button onPress={handlePrevPage}>Página Anterior</Button>
        <Button onPress={handleNextPage}>Próxima Página</Button>
      </HStack>

    </Box>
  );
};

export default Pergunta_Resposta;
