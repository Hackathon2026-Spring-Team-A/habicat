import { useState, useEffect } from "react";
import {
    Modal, View, Text, TextInput,
    TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform
} from "react-native";

type Props = {
    visible: boolean;
    dateString: string;
    existingMemo: string | null;
    onSubmit: (memo: string) => void;
    onClose: () => void;
};

export default function ReportModal({ visible, dateString, existingMemo, onSubmit, onClose }: Props) {
    const [memo, setMemo] = useState('');
    const isSubmitted = existingMemo !== null;

    useEffect(() => {
        setMemo(existingMemo ?? '');
    }, [visible]);

    const formatDate = (str: string) => {
        if (!str || !str.includes('-')) return '';
        const [y, m, d] = str.split('-');
        return `${y}年${parseInt(m)}月${parseInt(d)}日`;
    };

    return (
        <Modal visible={visible} transparent animationType="fade">

            <View style={styles.overlay}>
                <KeyboardAvoidingView
                    style={styles.centered}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={styles.modal}>

                        {/* ヘッダー */}
                        <View style={styles.headerRow}>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Text style={styles.closeIcon}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.date}>{formatDate(dateString)}</Text>

                        {/* コメント欄 */}
                        <Text style={styles.label}>コメント</Text>
                        {isSubmitted ? (
                            <View style={styles.readOnlyBox}>
                                <Text style={styles.readOnlyText}>{existingMemo}</Text>
                            </View>
                        ) : (
                            <TextInput
                                style={styles.input}
                                placeholder="コメントを入力してください"
                                placeholderTextColor="#bbb"
                                value={memo}
                                onChangeText={setMemo}
                                multiline
                                maxLength={200}
                            />
                        )}

                        {/* ボタン */}
                        {!isSubmitted && (
                        <TouchableOpacity
                            style={[styles.submitButton, !memo.trim() && styles.submitDisabled]}
                            onPress={() => { if (memo.trim()) onSubmit(memo.trim()); }}
                            disabled={!memo.trim()}
                        >
                        <Text style={styles.submitText}>登録</Text>
                        </TouchableOpacity>
                        )}

                    </View>
                </KeyboardAvoidingView>
            </View>

        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)', // カレンダーがうっすら見える透明度
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    centered: {
        justifyContent: 'center',
    },
    modal: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
    },
    header: {
        fontSize: 14,
        color: '#888',
        marginBottom: 6,
    },
    date: {
        fontSize: 16,
        fontWeight: '500',
        color: '#111',
        textAlign: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 13,
        color: '#444',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 10,
        padding: 12,
        fontSize: 14,
        height: 160,
        textAlignVertical: 'top',
        color: '#111',
        marginBottom: 24,
    },
    readOnlyBox: {
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 12,
        height: 160,
        marginBottom: 24,
    },
    readOnlyText: {
        fontSize: 14,
        color: '#444',
        lineHeight: 22,
    },
    headerRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    },
    closeButton: {
    padding: 4,
    },
    closeIcon: {
    fontSize: 16,
    color: '#888',
    },
    submitButton: {
        width: '100%',
        padding: 14,
        borderRadius: 10,
        backgroundColor: '#1E3A8A',
        alignItems: 'center',
    },
    submitDisabled: {
        backgroundColor: '#93c5fd',
    },
    submitText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
});