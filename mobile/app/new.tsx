import { Link } from 'expo-router';
import { useState } from 'react';
import { api } from '../src/lib/api';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, Switch, TextInput, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';

import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';

import Icon from '@expo/vector-icons/Feather';
import NLWLogo from '../src/assets/nlw-spacetime-logo.svg';

export default () => {

  const router = useRouter();
  const { bottom, top } = useSafeAreaInsets();

  const [preview, setPreview] = useState<string | null>(null);

  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const openImagePicker = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if(result.assets[0]){
        setPreview(result.assets[0].uri)
      }
    } catch (err) { 
      //DEU ERRADO
    }
  }

  const handleCreateMemory = async () => {
    
    const token = await SecureStore.getItemAsync('token');

    let coverUrl = '';

    if(preview){
      const uploadFormData = new FormData();

      uploadFormData.append('file', { //INSERINDO NO FORMDATA
        uri: preview,
        name: 'image.jpg',
        type: 'image/jpeg',
      } as any)

      const uploadResponse = await api.post('/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data' //DEVEMOS ESPECIFICAR O TIPO DE ARQUIVO 
        }
      })

      coverUrl = uploadResponse.data.fileUrl;
    }

    await api.post('/memories', {
      content,
      isPublic,
      coverUrl,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    router.push('/memories')
  }

  return(
    <ScrollView className="flex-1 px-8" contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}>
      <View className="flex-row mt-4 items-center justify-between">
        <NLWLogo/>

        <Link href="/memories" asChild>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
            <Icon name="arrow-left" size={16} color="#FFF"/>
          </TouchableOpacity>
        </Link>
      </View>

      <View className="mt-6 space-y-6">
        <View className="flex-row items-center gap-2">
          <Switch 
            value={isPublic}
            onValueChange={setIsPublic}
            thumbColor={isPublic ? "#9B79EA" : "#9E9EA0"}
            trackColor={{ false: "#767577", true: "#372560" }}
          />

          <Text className="font-body text-base text-gray-200">
            Tornar memória pública
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={openImagePicker}
          className="h-32 justify-center rounded-lg border border-dashed border-gray-500 bg-black/20"
        >
          {preview ? (
            <Image source={{ uri: preview }} className="h-full w-full rounded-lg object-cover"/>
          ) : (
            <View className="flex-row items-center justify-center gap-2">
              <Icon name="image" color={"#AAA"}/>

              <Text className="font-body text-sm text-gray-200">
                Adicionar foto ou vídeo de capa
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          multiline
          value={content}
          textAlignVertical='top'
          onChangeText={setContent}
          placeholderTextColor={"#56565A"}
          placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre"
          className="p-0 font-body text-lg text-gray-50"
        />

        <TouchableOpacity 
          activeOpacity={0.8} 
          onPress={handleCreateMemory}
          className="items-center rounded-full bg-green-500 px-5 py-2"
        >
          <Text className="font-alt text-sm uppercase text-black">
            Salvar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}