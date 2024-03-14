import React, { Component} from 'react';
import moment from 'moment';
import {
    Modal,
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { Checkbox} from 'react-native-paper';



class EditInvoiceModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            note:{},
            title: "",
            date: "",
            body: "",
            loading: false,
            errorMessage: ''
        };
    }
    componentDidMount() {
        // state value is updated by selected employee data
        const { note_title, note_date,  note_body  } = this.props.selectedInvoice;
        this.setState({
           title: note_title,
            body: note_body,
            date: note_date,
        }),
        this.getData();
    }
    getData = () => {
        this.setState({ errorMessage: "", loading: true })
        fetch(`https://65e695fbd7f0758a76e897e1.mockapi.io/api/v1/note/${this.props.selectedInvoice.id}`, {
          method: "GET"
        })
          .then(res => res.json())
          .then(res => this.setState({
            note: res,
            loading: false, errorMessage: ""
          }))
          .catch(() => this.setState({
            loading: false,
            errorMessage: "Network Error. Please try again."
          }))
      }
    toggleCheck = () => {
        this.setState({ status: !this.state.status });
      }
    handleChange = (value, state) => {
        this.setState({ [state]: value })
    }

    updateInvoice = () => {
        // destructure state
        const currentTimestamp = new Date().getTime();
        const { title,body } = this.state;
        this.setState({ errorMessage: "", loading: true });
        
        if (title && body ) {
    
            // selected employee is updated with employee id
            fetch(`https://65e695fbd7f0758a76e897e1.mockapi.io/api/v1/note/${this.props.selectedInvoice.id}`, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: this.state.title,
                    body: this.state.body,
                    date: currentTimestamp,
                })
            })
                .then(res => res.json())
                .then(res => {
                    this.props.closeModal();
                    this.props.updateInvoice({
                        title: res.title,
                        body: res.body,
                        date: res.date,
                        id: this.props.selectedInvoice.id
                    });
                })
                .catch(() => {
                    this.setState({ errorMessage: "Network Error. Please try again.", loading: false })
                })
        } else {
            this.setState({ errorMessage: "Fields are empty.", loading: false })
        }
    }

    render() {
        const { isOpen, closeModal } = this.props;
        const { title, date, body, loading, errorMessage, note } = this.state;
        return (
            <Modal
                visible={isOpen}
                onRequestClose={closeModal}
                animationType="slide"
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Update Invoice</Text>

                    <TextInput
                        defaultValue={note.title}
                        style={styles.textBox}
                        onChangeText={(text) => this.handleChange(text, "title")}
                        placeholder="Title" />

                    <TextInput
                        defaultValue={note.body}
                        style={styles.textarea}
                        multiline={true}
                        numberOfLines={4}
                        onChangeText={(text) => this.handleChange(text, "body")}
                        placeholder="Body" />
                    {loading ? <Text
                        style={styles.message}>Please Wait...</Text> : errorMessage ? <Text
                            style={styles.message}>{errorMessage}</Text> : null}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={this.updateInvoice}
                            style={{ ...styles.button, marginVertical: 0 }}>
                            <Text style={styles.buttonText}>Update</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={closeModal}
                            style={{ ...styles.button, marginVertical: 0, marginLeft: 10, backgroundColor: "tomato" }}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>
        );
    }
}



export default EditInvoiceModal;

const styles = StyleSheet.create({
    container: {
        padding: 15
    },
    title: {
        fontWeight: "bold",
        fontSize: 20,
        marginBottom: 20
    },
    textBox: {
        borderWidth: 1,
        borderRadius: 6,
        borderColor: "rgba(0,0,0,0.3)",
        marginBottom: 15,
        fontSize: 18,
        padding: 10
    },
    buttonContainer: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center"
    },
    button: {
        borderRadius: 5,
        marginVertical: 20,
        alignSelf: 'flex-start',
        backgroundColor: "gray",
    },
    buttonText: {
        color: "white",
        paddingVertical: 6,
        paddingHorizontal: 10,
        fontSize: 16
    },
    message: {
        color: "tomato",
        fontSize: 17
    },
    textarea: {
        width: '100%',
        height: 200,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
      },
})