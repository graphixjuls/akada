import { Redirect } from 'expo-router';
import { useStore } from '@/store/AppStore';

/** Returning students go straight Home; everyone else starts at the Splash. */
export default function Index() {
  const { data } = useStore();
  return <Redirect href={data.profile ? '/(tabs)' : '/splash'} />;
}
