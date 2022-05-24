import React from "react";
import { ActivityIndicator } from "react-native";
import { gql, useQuery } from "@apollo/client";
import { logUserOut } from "../apollo";
import styled from "styled-components/native";
import DismissKeyboard from "../components/DismissKeyboard";
import { FontAwesome5 } from "@expo/vector-icons";

const ME_QUERY = gql`
  query me {
    me {
      id
      username
      email
      programs {
        id
        title
        isLiked
        isMine
        isPublic
        workouts {
          title
          workoutIndex
          workoutSets {
            id
            exercise
            setCount
            repCount
          }
        }
      }
      exercises {
        id
        exercise
        bodyPart
      }
    }
  }
`;

const Container = styled.ScrollView`
  margin: 20px 10px;
`;

const HeaderContainer = styled.View`
  margin: 20px 15px 15px 5px;
`;

const Header = styled.Text`
  color: ${(props) => props.theme.mainColor};
  font-size: 25px;
  font-weight: 700;
`;

const ProfileContainer = styled.View`
  margin-bottom: 15px;
  padding: 20px;
  border-radius: 20px;
  background-color: ${(props) => props.theme.cardColor};
`;

const ProfileText = styled.Text`
  color: ${(props) => props.theme.fontColor};
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 7px;
`;

const Button = styled.TouchableOpacity`
  border-radius: 30px;
`;

const ButtonText = styled.Text`
  color: ${(props) => props.theme.mainColor};
  font-size: 15px;
  font-weight: 600;
  text-align: center;
`;

const IndicatorContainer = styled.View`
  flex: 1;
  justify-content: center;
`;

const ListsContainer = styled.View`
  margin-bottom: 30px;
`;

const ListTouchable = styled.TouchableOpacity``;

const ListTextContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ListText = styled.Text`
  padding: 15px 20px;
  font-size: 18px;
  font-weight: 500;
  color: ${(props) => props.theme.fontColor};
`;

const BorderLine = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.gray};
  opacity: 0.5;
`;

export default function Setting({ navigation }) {
  const { data, loading } = useQuery(ME_QUERY);

  if (loading)
    return (
      <IndicatorContainer>
        <ActivityIndicator />
      </IndicatorContainer>
    );

  const programs = data?.me.programs;
  console.log(programs);
  const myPrograms = programs.filter((program) => program.isMine == true);
  const likedPrograms = programs.filter((program) => program.isLiked == true);
  const exercises = data?.me.exercises;

  return (
    <DismissKeyboard>
      <Container showsVerticalScrollIndicator={false}>
        <HeaderContainer>
          <Header>Settings</Header>
        </HeaderContainer>
        <ProfileContainer>
          <ProfileText>{data?.me.username}</ProfileText>
          <ProfileText style={{ marginBottom: 0 }}>
            {data?.me.email}
          </ProfileText>
        </ProfileContainer>

        <ListsContainer>
          <ListTouchable
            onPress={() =>
              navigation.navigate("LikedPrograms", {
                programs: myPrograms,
                exercises,
              })
            }
          >
            <ListTextContainer>
              <ListText>My programs</ListText>
              <ListText>
                <FontAwesome5 name="angle-right" size={16} />
              </ListText>
            </ListTextContainer>
            <BorderLine />
          </ListTouchable>

          <ListTouchable
            onPress={() =>
              navigation.navigate("LikedPrograms", {
                programs: likedPrograms,
                exercises,
              })
            }
          >
            <ListTextContainer>
              <ListText>Favorite programs</ListText>
              <ListText>
                <FontAwesome5 name="angle-right" size={16} />
              </ListText>
            </ListTextContainer>
            <BorderLine />
          </ListTouchable>

          <ListTouchable
            onPress={() => {
              navigation.navigate("ExerciseList", {
                userId: data?.me.id,
                exercises,
              });
            }}
          >
            <ListTextContainer>
              <ListText>My exercises</ListText>
              <ListText>
                <FontAwesome5 name="angle-right" size={16} />
              </ListText>
            </ListTextContainer>
            <BorderLine />
          </ListTouchable>
        </ListsContainer>
        <Button onPress={() => logUserOut()}>
          <ButtonText>Logout</ButtonText>
        </Button>
      </Container>
    </DismissKeyboard>
  );
}
