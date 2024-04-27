import React, { useState, useEffect } from 'react';
import { Button, Select, VStack, Input, FlatList, Box, Text, Spinner, HStack } from 'native-base';
import ConfirmationDialog from './ConfirmationDialog';

const chemicalElements = ['Hidrogênio', 'Oxigênio', 'Hélio', 'Neônio', 'Argônio', 'Criptônio', 'Xenônio', 'Radônio', 'Oganessônio'];

const CRUD = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [text, setText] = useState('');
  const [selectedElement, setSelectedElement] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

 
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const cancelDeleteAllQuestions = () => {
    setShowDeleteConfirmation(false);
  };

  const handleDeleteAllQuestions = async () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteAllQuestions = async () => {
    setShowDeleteConfirmation(false);
      await fetch('https://apigametcc.azurewebsites.net/api/pergunta', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      await fetch('https://apigametcc.azurewebsites.net/api/resposta', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setQuestions([]);
      setAnswers([]);
  };

  const handleAddQuestion = async () => {
    const data = {
      question: text,
      chemicalElement: selectedElement
    };
    await fetch('https://apigametcc.azurewebsites.net/api/pergunta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  };

  const handleUpdateQuestion = async () => {
    const data = {
      question: text,
      chemicalElement: selectedElement
    };
    const url = `https://apigametcc.azurewebsites.net/api/pergunta/${selectedId}`;
    await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  };

  const handleDeleteQuestion = async () => {
    const data = {
      question: text,
      chemicalElement: selectedElement
    };
    const url = `https://apigametcc.azurewebsites.net/api/pergunta/${selectedId}`;
    await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  };

  const handleSelectQuestion = (id, element, question) => {
    setSelectedId(id);
    setSelectedElement(element);
    setText(question);
  };

  const handleReloadQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const perguntaPromise = fetch('https://apigametcc.azurewebsites.net/api/pergunta');
      const respostaPromise = fetch('https://apigametcc.azurewebsites.net/api/resposta');

      const [perguntaResponse, respostaResponse] = await Promise.all([perguntaPromise, respostaPromise]);

      if (!perguntaResponse.ok || !respostaResponse.ok) {
        throw new Error('Erro ao carregar dados');
      }

      const perguntaData = await perguntaResponse.json();
      const respostaData = await respostaResponse.json();

      const perguntaComScore = perguntaData.map((pergunta, index) => {
        // Verifica se há uma resposta correspondente para o índice atual
        if (index < respostaData.length) {
          // Encontra a resposta correspondente usando o mesmo índice
          const respostaCorrespondente = respostaData[index];
          // Define o score da pergunta como o score da resposta correspondente
          pergunta.score = respostaCorrespondente.score;
        }
        return pergunta;
      });

      setQuestions(perguntaComScore);
      setAnswers(respostaData);
      setLoadingQuestions(false);
    } catch (error) {
      console.error('Erro ao carregar perguntas e respostas:', error);
      setLoadingQuestions(false);
    }
  };


  const getTotalScore = () => {
    return answers.reduce((total, answer) => total + answer.score, 0);
  };

  useEffect(() => {
    handleReloadQuestions();
  }, []);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage * pageSize <= questions.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const paginatedQuestions = questions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <VStack space={2}>
      <Select
        selectedValue={selectedElement}
        minWidth={200}
        accessibilityLabel="Selecione um elemento químico"
        placeholder="Selecione um elemento químico"
        onValueChange={(itemValue) => setSelectedElement(itemValue)}
      >
        {chemicalElements.map((element, index) => (
          <Select.Item key={index} label={element} value={element} />
        ))}
      </Select>
      <Input
        placeholder="Digite a pergunta"
        value={text}
        maxLength={300}
        onChangeText={setText}
      />
      <Input
        placeholder="ID"
        value={selectedId ? selectedId.toString() : ''}
        isReadOnly
      />
      <Button onPress={handleAddQuestion}>Adicionar</Button>
      <Button onPress={handleUpdateQuestion}>Atualizar</Button>
      <Button onPress={handleDeleteQuestion}>Deletar</Button>
      <Button onPress={handleReloadQuestions}>Gerar Perguntas/Respostas</Button>
      <Button colorScheme="red" onPress={handleDeleteAllQuestions}>Deletar Todas as Perguntas</Button>
      <ConfirmationDialog 
        isOpen={showDeleteConfirmation} 
        onClose={cancelDeleteAllQuestions} 
        onConfirm={confirmDeleteAllQuestions} 
      />

      {loadingQuestions ? (
        <Spinner accessibilityLabel="Carregando perguntas" />
      ) : (
        <>
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
                <Text>Pergunta: {item.question}</Text>
                <Text>Elemento Químico: {item.chemicalElement}</Text>
                <Text>Resultado: {item.score}</Text>
                <Button onPress={() => handleSelectQuestion(item.id, item.chemicalElement, item.question)}>Selecionar</Button>
              </Box>
            )}
            keyExtractor={(item) => item.id.toString()}
            mb={4}
          />
        </>
      )}

      <HStack space={2}>
        <Button onPress={handlePrevPage} >Página Anterior</Button>
        <Button onPress={handleNextPage} >Próxima Página</Button>
      </HStack>

      <Box mt={4}>
        <Text>Total de Pontos: {getTotalScore()}</Text>
      </Box>
    </VStack>
  );
};

export default CRUD;
