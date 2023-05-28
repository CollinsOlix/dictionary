import { useState } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  Platform,
  StatusBar,
  Text,
  StyleSheet,
  Image,
  SectionList,
} from "react-native";

// getWordMeaning("hot");
const App = () => {
  const getWordMeaning = async (word) => {
    setIsLoading(true);
    setHelperText(`Searching the web for ${word}`);
    setWord("");
    setPhonetics("");
    try {
      const datafetch = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      const [resp] = await datafetch.json();
      return await resp;
    } catch (error) {
      alert(error);
    }
  };
  const [word, setWord] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [phonetics, setPhonetics] = useState("");
  const [helperText, setHelperText] = useState(
    "Enter a word above and press Enter"
  );

  const [DATA, setData] = useState([]);
  let count = [];
  return (
    <SafeAreaView
      style={[
        {
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        },
        styles.wrapper,
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>English Dictionary</Text>
        {/*  Union Jack Image from publicdomainpictures.net*/}
        <Image
          style={styles.union}
          source={require("./assets/unionJack.png")}
        />
      </View>
      <View style={styles.body}>
        <TextInput
          placeholder="Search"
          style={styles.searchBar}
          onSubmitEditing={(e) => {
            (async () => await getWordMeaning(e.nativeEvent["text"]))().then(
              (res) => {
                setHelperText("Enter a word above and press Enter");
                setIsLoading(false);
                setWord(res.word);
                setPhonetics(res.phonetic);
                setData([
                  {
                    title: "Meanings",
                    data: [
                      ...res.meanings
                        .flatMap((m, j) => {
                          count.push(
                            ...new Array(
                              res.meanings[j].definitions.length
                            ).fill(j)
                          );
                          return m.definitions;
                        })
                        .flatMap((d, index) => {
                          return `Meaning${index + 1} :    Part of Speech:    ${
                            res.meanings[count[index]].partOfSpeech
                          }
                          \n${d.definition}${
                            d.example === undefined
                              ? ""
                              : `\nExample: ${d.example}`
                          }`;
                        }),
                    ],
                  },
                  {
                    title: "Synonyms",
                    data: [
                      ...res.meanings
                        .flatMap((m) => m.definitions)
                        .flatMap((d) => d.synonyms),
                    ],
                  },
                  {
                    title: "Antonyms",
                    data: [
                      ...res.meanings
                        .flatMap((m) => m.definitions)
                        .flatMap((d) => d.antonyms),
                    ],
                  },
                ]);
                console.log(
                  ...res.meanings
                    .flatMap((m) => m.definitions)
                    .flatMap((d) => d.synonyms)
                );
              }
            );
          }}
        ></TextInput>
        <Text style={{ paddingHorizontal: 10, fontSize: 20 }}>
          {helperText}
        </Text>
        <View style={styles.meanings}>
          <View style={styles.wordIntro}>
            <Text style={styles.word}>{word}</Text>
            <Text style={styles.phonetics}>{phonetics}</Text>
          </View>
          {isLoading ? (
            <Text style={{ alignSelf: "center", fontSize: 40 }}>
              Waiting...
            </Text>
          ) : (
            <SectionList
              sections={DATA}
              keyExtractor={(item, index) => item + index}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Text style={styles.title}>{item}</Text>
                </View>
              )}
              renderSectionHeader={({ section: { title } }) => (
                <Text style={styles.sectionHeaderText}>{title}</Text>
              )}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  header: {
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: "#5354c1",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "flex-end",
  },
  headerText: {
    fontSize: 25,
    color: "white",
  },
  union: {
    width: 40,
    height: 40,
    // aspectRatio: "16/9",
  },
  body: {
    flex: 1,
    padding: 10,
  },
  searchBar: {
    backgroundColor: "#9a9bf2",
    padding: 7,
    color: "white",
    borderRadius: 7,
    fontSize: 20,
  },

  wordIntro: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  word: {
    padding: 0,
    margin: 0,
    fontSize: 30,
    fontWeight: 900,
    textTransform: "capitalize",
  },
  phonetics: {
    padding: 0,
    margin: 5,
    fontSize: 20,
    fontWeight: 300,
    fontStyle: "italic",
  },
  meanings: {
    flex: 1,
    marginTop: 20,
    backgroundColor: "#9a9bf2",
    borderRadius: 7,
    padding: 5,
  },
  sectionHeaderText: {
    fontSize: 25,
    backgroundColor: "#5354c1",
    color: "#1c1c1c",
    borderRadius: 7,
    padding: 5,
  },
  item: {
    fontSize: 20,
    borderRadius: 7,
    padding: 5,
    marginVertical: 5,
    backgroundColor: "white",
    textTransform: "capitalize",
  },
});

export default App;
