import * as React from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl, SafeAreaView, Dimensions } from 'react-native';
import { Card,Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import BASE_URL from '@/backend/config';
import { useFonts } from 'expo-font';
import { useState } from 'react';
import { BarChart, PieChart } from "react-native-chart-kit";
import "../../global.css"

const Dashboard = () => {
  const [refreshing, setRefreshing] = useState(false);
   const [totals, setTotals] = useState({ totalUser: 0, totalBook: 0, FSG:0 , FP:0 ,FSKM: 0,aCount: 0,rCount:0,sCount:0,totalSold: 0});
  const router = useRouter();
   const width = Dimensions.get('window').width

  const [loaded] = useFonts({
    Poppins: require('../../assets/fonts/Poppins-Medium.ttf'),
  });

  // Wait for fonts to load before rendering UI that depends on it
  if (!loaded) {
    return null; 
  }


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const barData = {
  labels: ['FSG', 'FSKM', 'FP'],
  datasets: [
    {
      data: [totals.FP, totals.FSKM, totals.FSG],
    },
  ],
  };

  let i =5
  const pieData = [
  {
    name: "Sold",
    population: totals.sCount,
    color: "#87CEFA",
    legendFontColor: "black",
    legendFontSize: 15
  },

   {
    name: "Reserved",
    population: totals.rCount,
    color: "#004687",
    legendFontColor:"black",
    legendFontSize: 15
  },
  
  {
    name: "Available",
    population: totals.aCount,
    color: "#6495ED",
    legendFontColor: "black",
    legendFontSize: 15
  },
  
];

  
const chartConfig = {
  backgroundGradientFrom: 'white',
  backgroundGradientTo: 'white',
  color: (opacity = 1) => `rgb(41, 95, 152), ${opacity})`,
  barPercentage: 1.5,
};

  

  

  React.useEffect(() => {
    fetch(`${BASE_URL}/dashboard`)
      .then(res => res.json())
      .then(data => setTotals(data))
      .catch(err => console.error(err));
  }, [refreshing]);

  

  return (

    
   <SafeAreaView className="flex-1">
  <LinearGradient
    colors={['#ffffff', '#7DC2FA']}
    start={{ x: 1, y: 0 }}
    end={{ x: 0, y: 1 }}
    style={{ flex: 1 }}
  >
   <ScrollView
  contentContainerStyle={{ flexGrow:1 }}
  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
>
      <View className='flex-row flex-wrap justify-between px-3'>

        <View className="w-[48%]  mb-4  mt-3">
          <Card className=" w-full h-[150px] rounded-2xl shadow-md justify-center " style={{backgroundColor: '#AFDDFF'}}>
            <Card.Content className="p-4">
              <Text className="text-3xl" style={{fontFamily: 'Poppins', textAlign: 'center',color: 'white'}}>Total Books</Text>
              <Text className="text-2xl" style={{fontFamily: 'Poppins', textAlign: 'center',color: 'white'}}>{totals.totalBook}</Text>
            </Card.Content>
          </Card>
        </View>
         <View className="w-[48%]  mb-4  mt-3">
          <Card className=" w-full h-[150px] rounded-2xl shadow-md justify-center" style={{backgroundColor: '#AFDDFF'}}>
            <Card.Content className="p-4">
              <Text className="text-3xl" style={{fontFamily: 'Poppins', textAlign: 'center',color: 'white'}}>Total Users</Text>
              <Text className="text-2xl" style={{fontFamily: 'Poppins', textAlign: 'center',color: 'white'}}>{totals.totalUser}</Text>
            </Card.Content>
          </Card>
        </View>
      </View>

      <View  className='px-3'>
        <Card>
          <Card.Content className='rounded-2xl' style={{backgroundColor: '#AFDDFF'}}>
           <Text className="text-3xl" style={{fontFamily: 'Poppins', textAlign: 'center',color: 'white'}}>Books By Faculty</Text>
           <BarChart 
                  
                  data={barData}
                  width={width - 55}
                  height={220}
                  fromZero
                  chartConfig={chartConfig}
                  style={{ borderRadius: 16, marginTop: 10}} 
                  yAxisLabel={''} yAxisSuffix={''}
                  showValuesOnTopOfBars
                  withInnerLines = {false}      
                  />
          </Card.Content>
        </Card>
      </View>

      <View  className='px-3 mt-3'>
        <Card>
          <Card.Content className='rounded-2xl' style={{backgroundColor: '#AFDDFF'}}>
        <Text className="text-3xl" style={{fontFamily: 'Poppins', textAlign: 'center',color: 'white'}}>Books Status</Text>
          <PieChart
              data={pieData}
              width={width - 55}
              height={200}
              chartConfig={chartConfig}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              center={[0, 0]}
              absolute
            />
          </Card.Content>
        </Card>

      </View>

      
        <View className="px-3 mt-3 mb-3 ">
          <Card className=" w-full h-[150px] rounded-2xl shadow-md justify-center " style={{backgroundColor: '#AFDDFF'}}>
            <Card.Content className="p-4">
              <Text className="text-3xl" style={{fontFamily: 'Poppins', textAlign: 'center',color: 'white'}}>Total Sold</Text>
              <Text className="text-2xl" style={{fontFamily: 'Poppins', textAlign: 'center',color: 'white'}}>RM{totals.totalSold}</Text>
            </Card.Content>
          </Card>
        </View>

    </ScrollView>
  </LinearGradient>
</SafeAreaView>

  );
};

export default Dashboard;
