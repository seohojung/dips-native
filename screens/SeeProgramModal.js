import React, { useEffect } from "react";
import styled from "styled-components/native";
import { gql, useMutation } from "@apollo/client";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import StartWorkoutButton from "../components/Buttons/StartWorkoutButton";

const TOGGLE_LIKE_MUTATION = gql`
  mutation toggleLike($id: Int!) {
    toggleLike(id: $id) {
      ok
      error
    }
  }
`;

const Container = styled.ScrollView`
  margin: 15px 10px 0 10px;
`;

const HeaderContainer = styled.View`
  margin: 50px 15px 5px 15px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ProgramTitle = styled.Text`
  color: ${(props) => props.theme.mainColor};
  font-size: 25px;
  font-weight: 700;
  width: 85%;
`;
``;
const InfoContainer = styled.View`
  margin: 5px;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

const LikeContainer = styled.TouchableOpacity`
  margin: 5px;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`;

const InfoText = styled.Text`
  color: ${(props) => props.theme.fontColor};
  font-size: 16px;
  font-weight: 500;
`;

const EditProgram = styled.TouchableOpacity`
  color: ${(props) => props.theme.fontColor};
`;

const EditText = styled.Text`
  color: ${(props) => props.theme.mainColor};
  font-size: 16px;
  font-weight: 600;
`;

const WorkoutContainer = styled.View`
  margin-bottom: 15px;
  border-radius: 20px;
  background-color: ${(props) => props.theme.cardColor};
  padding: 15px 25px;
`;

const WorkoutTitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const WorkoutTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${(props) => props.theme.fontColor};
  width: 70%;
`;

const ExerciseContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ExerciseTitleContainer = styled.View`
  width: 70%;
`;

const SetbyRepContainer = styled.View`
  flex-direction: row;
`;

const ExerciseTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${(props) => props.theme.fontColor};
`;

const ButtonContainer = styled.TouchableOpacity`
  margin: 10px 15px 10px 0;
`;

const ButtonText = styled.Text`
  color: ${(props) => props.theme.mainColor};
  font-size: 16px;
  font-weight: 600;
  text-align: right;
`;

export default function SeeProgramModal({
  program,
  exercises,
  setModalVisible,
}) {
  const directStart = true;

  const toggleLikeUpdate = (cache, result) => {
    const {
      data: {
        toggleLike: { ok },
      },
    } = result;
    if (ok) {
      cache.modify({
        id: `Program:${program.id}`,
        fields: {
          isLiked(prev) {
            return !prev;
          },
        },
      });
    }
  };

  const [toggleLikeFunction] = useMutation(TOGGLE_LIKE_MUTATION, {
    variables: {
      id: program.id,
    },
    update: toggleLikeUpdate,
  });

  return (
    <Container showsVerticalScrollIndicator={false}>
      <HeaderContainer>
        <ProgramTitle>{program.title}</ProgramTitle>
        {program.isMine ? (
          <EditProgram
            onPress={() =>
              navigation.navigate("EditProgram", { program, exercises })
            }
          >
            <EditText>Edit</EditText>
          </EditProgram>
        ) : null}
      </HeaderContainer>

      <ButtonContainer
        onPress={() => {
          setModalVisible(false);
        }}
      >
        <ButtonText>Close</ButtonText>
      </ButtonContainer>

      <InfoContainer>
        {program.isMine ? (
          <>
            <InfoContainer>
              <InfoText>
                <FontAwesome name="user" size={16} />
              </InfoText>
              <InfoText style={{ marginLeft: 7 }}>My program</InfoText>
            </InfoContainer>
            <InfoContainer>
              {program.isPublic ? (
                <>
                  <InfoText>
                    <FontAwesome5 name="lock-open" size={14} />
                  </InfoText>
                  <InfoText style={{ marginLeft: 7 }}>Public</InfoText>
                </>
              ) : (
                <>
                  <InfoText>
                    <FontAwesome5 name="lock" size={14} />
                  </InfoText>
                  <InfoText style={{ marginLeft: 7 }}>Private</InfoText>
                </>
              )}
            </InfoContainer>
          </>
        ) : (
          <>
            <InfoContainer>
              <InfoText>
                <FontAwesome name="user" size={17} />
              </InfoText>
              <InfoText style={{ marginLeft: 7 }}>
                {program?.user.username}
              </InfoText>
            </InfoContainer>

            <LikeContainer onPress={toggleLikeFunction}>
              {program.isLiked ? (
                <>
                  <InfoText>
                    <FontAwesome name="star" size={16} />
                  </InfoText>
                  <InfoText style={{ marginLeft: 7 }}>Unlike</InfoText>
                </>
              ) : (
                <>
                  <InfoText>
                    <FontAwesome name="star-o" size={16} />
                  </InfoText>
                  <InfoText style={{ marginLeft: 7 }}>Like</InfoText>
                </>
              )}
            </LikeContainer>
          </>
        )}
      </InfoContainer>

      {program?.workouts.map((workout, workoutIndex) => {
        return (
          <WorkoutContainer key={workoutIndex}>
            <WorkoutTitleContainer>
              <WorkoutTitle>{workout.title}</WorkoutTitle>
              {directStart ? (
                <StartWorkoutButton
                  text="Start"
                  onPress={() => {
                    navigation.navigate("CreateRecord", {
                      baseProgramId: program?.id,
                      programTitle: program?.title,
                      workout,
                      exercises,
                    }),
                      { ...{ navigation } };
                  }}
                />
              ) : null}
            </WorkoutTitleContainer>

            {workout?.workoutSets.map((workoutSet, workoutSetIndex) => {
              return (
                <ExerciseContainer key={workoutSetIndex}>
                  <ExerciseTitleContainer>
                    <ExerciseTitle>{workoutSet.exercise}</ExerciseTitle>
                  </ExerciseTitleContainer>

                  <SetbyRepContainer>
                    <ExerciseTitle>{workoutSet.setCount}</ExerciseTitle>
                    {workoutSet.repCount ? (
                      <ExerciseTitle> x {workoutSet.repCount}</ExerciseTitle>
                    ) : (
                      <ExerciseTitle> sets</ExerciseTitle>
                    )}
                  </SetbyRepContainer>
                </ExerciseContainer>
              );
            })}
          </WorkoutContainer>
        );
      })}
    </Container>
  );
}
