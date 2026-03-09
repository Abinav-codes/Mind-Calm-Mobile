import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAuth } from "../../src/context/AuthContext";

export default function LoginScreen() {
    const { signIn, signUp } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleAuth = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        setLoading(true);
        const { error } = isSignUp
            ? await signUp(email, password)
            : await signIn(email, password);

        setLoading(false);

        if (error) {
            Alert.alert("Error", error.message);
        } else {
            router.replace("/(tabs)");
        }
    };

    return (
        <LinearGradient
            colors={["#1B2250", "#0F1535", "#1B2250"]}
            style={{ flex: 1 }}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1, justifyContent: "center", paddingHorizontal: 24 }}
            >
                {/* Logo / Title */}
                <Animated.View entering={FadeInDown.delay(200).springify()}>
                    <View className="items-center mb-12">
                        <View
                            style={{
                                width: 72,
                                height: 72,
                                borderRadius: 36,
                                backgroundColor: "#8B5CF620",
                                justifyContent: "center",
                                alignItems: "center",
                                marginBottom: 16,
                            }}
                        >
                            <Ionicons name="water" size={36} color="#8B5CF6" />
                        </View>
                        <Text className="text-white text-3xl font-bold">MindCalm</Text>
                        <Text className="text-text-muted text-sm mt-2">
                            Your journey to inner peace
                        </Text>
                    </View>
                </Animated.View>

                {/* Form */}
                <Animated.View entering={FadeInDown.delay(400).springify()}>
                    {/* Email Input */}
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "rgba(255,255,255,0.06)",
                            borderRadius: 14,
                            paddingHorizontal: 16,
                            marginBottom: 12,
                            borderWidth: 1,
                            borderColor: "rgba(255,255,255,0.08)",
                        }}
                    >
                        <Ionicons name="mail-outline" size={20} color="rgba(255,255,255,0.4)" />
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Email address"
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            style={{
                                flex: 1,
                                color: "#FFFFFF",
                                paddingVertical: 16,
                                paddingLeft: 12,
                                fontSize: 15,
                            }}
                        />
                    </View>

                    {/* Password Input */}
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "rgba(255,255,255,0.06)",
                            borderRadius: 14,
                            paddingHorizontal: 16,
                            marginBottom: 24,
                            borderWidth: 1,
                            borderColor: "rgba(255,255,255,0.08)",
                        }}
                    >
                        <Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.4)" />
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Password"
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            secureTextEntry={!showPassword}
                            style={{
                                flex: 1,
                                color: "#FFFFFF",
                                paddingVertical: 16,
                                paddingLeft: 12,
                                fontSize: 15,
                            }}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                                name={showPassword ? "eye-off-outline" : "eye-outline"}
                                size={20}
                                color="rgba(255,255,255,0.4)"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        onPress={handleAuth}
                        disabled={loading}
                        activeOpacity={0.8}
                        style={{
                            paddingVertical: 18,
                            borderRadius: 14,
                            backgroundColor: "#6282E3",
                            alignItems: "center",
                            marginBottom: 16,
                        }}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text className="text-white text-lg font-bold">
                                {isSignUp ? "Create Account" : "Sign In"}
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Toggle */}
                    <TouchableOpacity
                        onPress={() => setIsSignUp(!isSignUp)}
                        activeOpacity={0.6}
                    >
                        <Text className="text-text-muted text-center text-sm">
                            {isSignUp
                                ? "Already have an account? Sign in"
                                : "Don't have an account? Sign up"}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}
