import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Controller, useForm } from "react-hook-form";
import MainButton from "../components/Buttons/MainButton";
import styled from "styled-components/native";
import DismissKeyboard from "../components/DismissKeyboard";
import WorkoutArray from "../components/create-program/WorkoutArray";

const Container = styled.ScrollView`
  margin: 20px 10px;
`;

const Header = styled.Text`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 15px;
  padding: 0 15px;
  color: ${(props) => props.theme.fontColor};
`;

const TitleContainer = styled.View`
  margin-bottom: 15px;
  padding: 0 15px;
  /* background-color: ${(props) => props.theme.cardColor}; */
  border-radius: 20px;
`;

const TitleInput = styled.TextInput`
  color: ${(props) => props.theme.fontColor};
  font-size: 20px;
  font-weight: 500;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const DescriptionInput = styled.TextInput`
  color: ${(props) => props.theme.fontColor};
  font-size: 16px;
`;

const CREATE_PROGRAM_MUTATION = gql`
  mutation createProgram(
    $title: String!
    $description: String
    $isPrivate: Boolean!
  ) {
    createProgram(
      title: $title
      description: $description
      isPrivate: $isPrivate
    ) {
      ok
      id
      error
    }
  }
`;

const CREATE_TEMPLATE_MUTATION = gql`
  mutation createTemplate(
    $programId: Int!
    $templateIndex: Int!
    $title: String!
  ) {
    createTemplate(
      programId: $programId
      templateIndex: $templateIndex
      title: $title
    ) {
      ok
      programId
      templateIndex
      error
    }
  }
`;

const CREATE_TEMPLATE_SET_MUTATION = gql`
  mutation createTemplateSet(
    $programId: Int!
    $templateIndex: Int!
    $exercise: [String]
    $setCount: Int! # $rir: Int
  ) {
    createTemplateSet(
      programId: $programId
      templateIndex: $templateIndex
      exercise: $exercise
      setCount: $setCount # rir: $rir
    ) {
      ok
      id
      error
    }
  }
`;

// Passing empty strings as default values creates one empty form automatically
const defaultValues = {
  templates: [
    {
      name: "",
      templateSets: [{ exercise: "", setCount: "" }],
    },
  ],
};

export default function CreateProgram() {
  const { handleSubmit, setValue, getValues, control, watch, setError } =
    useForm({
      defaultValues,
    });

  const [isPrivate, setIsPrivate] = useState(false);

  const toggleSwitch = () => setIsPrivate((previousState) => !previousState);

  const onCreateTemplateSetCompleted = (data) => {
    const {
      createTemplateSet: { ok, id: templateSetId, error },
    } = data;
    if (!ok) {
      setError("result", {
        message: error,
      });
    }
  };

  const onCreateTemplateCompleted = (data) => {
    const {
      createTemplate: { ok, programId, templateIndex, error },
    } = data;
    if (!ok) {
      setError("result", {
        message: error,
      });
    }

    const submissionData = getValues();
    submissionData.templates[templateIndex].templateSets.map((templateSet) => {
      createTemplateSetFunction({
        variables: {
          programId,
          templateIndex,
          exercise: templateSet.exercise,
          setCount: parseInt(templateSet.setCount),
        },
      });
    });
  };

  const onCreateProgramCompleted = (data) => {
    const {
      createProgram: { ok, id: programId, error },
    } = data;
    if (!ok) {
      setError("result", {
        message: error,
      });
    }

    const submissionData = getValues();
    submissionData.templates.map((template, templateIndex) => {
      createTemplateFunction({
        variables: { programId, templateIndex, title: template.name },
      });
    });
  };

  const [createProgramFunction, { loading, error }] = useMutation(
    CREATE_PROGRAM_MUTATION,
    {
      onCompleted: onCreateProgramCompleted,
    }
  );

  const [createTemplateFunction] = useMutation(CREATE_TEMPLATE_MUTATION, {
    onCompleted: onCreateTemplateCompleted,
  });

  const [createTemplateSetFunction] = useMutation(
    CREATE_TEMPLATE_SET_MUTATION,
    {
      onCompleted: onCreateTemplateSetCompleted,
    }
  );

  const onSubmitValid = (submissionData) => {
    if (loading) {
      return;
    }
    const { programTitle, description } = getValues();
    createProgramFunction({
      variables: { title: programTitle, description, isPrivate },
    });
  };

  return (
    <DismissKeyboard>
      <Container showsVerticalScrollIndicator={false}>
        {/* <Header>새 프로그램 만들기</Header> */}
        <TitleContainer>
          <Controller
            name="programTitle"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TitleInput
                placeholder="프로그램 이름"
                placeholderTextColor="#999999"
                onChangeText={(text) => setValue("programTitle", text)}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <DescriptionInput
                placeholder="프로그램 설명 (max.50)"
                placeholderTextColor="#999999"
                multiline={true}
                maxLength={50}
                onChangeText={(text) => setValue("description", text)}
              />
            )}
          />
        </TitleContainer>

        {/* <ToggleContainer>
            <ToggleText>프로그램 공개</ToggleText>
            <ToggleSwitch>
              <Switch
                trackColor={{ true: "#42a5f5" }}
                // thumbColor="#42a5f5"
                style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
                ios_backgroundColor="#cacfd2"
                onValueChange={toggleSwitch}
                value={isPrivate}
              />
            </ToggleSwitch>
          </ToggleContainer> */}

        <WorkoutArray
          {...{
            control,
            getValues,
            setValue,
          }}
        />

        <MainButton
          text="새 프로그램 저장"
          loading={loading}
          disabled={!watch("programTitle")}
          onPress={handleSubmit(onSubmitValid)}
        />
      </Container>
    </DismissKeyboard>
  );
}
