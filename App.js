import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput, Button, FlatList} from "react-native";
import AddInvoiceModal from "./src/AddInvoiceModal";
import EditInvoiceModal from "./src/EditInvoiceModal";
import DeleteInvoiceModal from "./src/deleteInvoiceModal";
import Moment from './src/date';

class App extends Component {
  state = {
    invoice: [],
    isAddInvoiceModalOpen: false,
    isEditInvoiceModalOpen: false,
    isDeleteInvoiceModalOpen: false,
    loading: false,
    errorMessage: "",
    selectedInvoice: {},
  }

  componentDidMount() {
    this.getData();
  }
  getData = () => {
    this.setState({ errorMessage: "", loading: true })
    fetch('https://65e695fbd7f0758a76e897e1.mockapi.io/api/v1/note', {
      method: "GET"
    })
      .then(res => res.json())
      .then(res => this.setState({
        invoice: res,
        loading: false, errorMessage: ""
      }))
      .catch(() => this.setState({
        loading: false,
        errorMessage: "Network Error. Please try again."
      }))
  }


 

  toggleAddInvoiceModal = () => {
    this.setState({ isAddInvoiceModalOpen: !this.state.isAddInvoiceModalOpen });
  }

  toggleEditInvoiceModal = () => {
    this.setState({ isEditInvoiceModalOpen: !this.state.isEditInvoiceModalOpen });
  }

  toggleDeleteInvoiceModal = () => {
    this.setState({ isDeleteInvoiceModalOpen: !this.state.isDeleteInvoiceModalOpen });
  }

  addInvoice = (data) => {
    // this.state.invoice array is seprated into object by rest operator
    this.setState({ invoice: [data, ...this.state.invoice] })
  }

  updateInvoice = (data) => {
    // updating invoice data with updated data if invoice id is matched with updated data id
    this.setState({ invoice: this.state.invoice.map(emp => emp.id == data.id ? data : emp)  });
  }

  deleteInvoice = invoiceId => {
    // delete invoice lsit with deleted data if invoice id is matched with updated data id
    this.setState({ invoice: this.state.invoice.filter(emp => emp.id !== invoiceId) })
  }


  render() {
    const { loading, errorMessage, invoice, isAddInvoiceModalOpen,
      isEditInvoiceModalOpen, isDeleteInvoiceModalOpen, selectedInvoice } = this.state;
    return (
      <ScrollView>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={this.toggleAddInvoiceModal}
            style={styles.button}>
            <Text style={styles.buttonText}>Add Note</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Note Lists:</Text>
          {(invoice.map((data, index) => <View
            style={styles.invoiceListContainer}
            key={data.id}>
            <Text style={{ ...styles.listItem, color: "tomato" }}>{index + 1}.</Text>
            <Text style={styles.name}>Title: {data.title}</Text>
            <Text style={styles.listItem}>Body: {data.body}</Text>
            <Moment timestamp={data.date} />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  this.toggleEditInvoiceModal();
                  this.setState({ selectedInvoice: data })
                }}
                style={{ ...styles.button, marginVertical: 0 }}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  this.toggleDeleteInvoiceModal();
                  this.setState({ selectedInvoice: data })
                }}
                style={{ ...styles.button, marginVertical: 0, marginLeft: 10, backgroundColor: "tomato" }}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>)) }
          {loading ? <Text
            style={styles.message}>Please Wait...</Text> : errorMessage ? <Text
              style={styles.message}>{errorMessage}</Text> : null}

          {/* AddinvoiceModal modal is open when add invoice button is clicked */}
          {isAddInvoiceModalOpen ? <AddInvoiceModal
            isOpen={isAddInvoiceModalOpen}
            closeModal={this.toggleAddInvoiceModal}
            addInvoice={this.addInvoice}
          /> : null}

          {/* EditinvoiceModal modal is open when edit button is clicked in particular invoice list*/}
          {isEditInvoiceModalOpen ? <EditInvoiceModal
            isOpen={isEditInvoiceModalOpen}
            closeModal={this.toggleEditInvoiceModal}
            selectedInvoice={selectedInvoice}
            updateInvoice={this.updateInvoice}
          /> : null}

          {/* DeleteinvoiceModal modal is open when delete button is clicked in particular invoice list*/}
          {isDeleteInvoiceModalOpen ? <DeleteInvoiceModal
            isOpen={isDeleteInvoiceModalOpen}
            closeModal={this.toggleDeleteInvoiceModal}
            selectedInvoice={selectedInvoice}
            updateInvoice={this.deleteInvoice}
          /> : null}
        </View>

      </ScrollView>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop:50
  },
  input: {
    height: 40,
    width:300,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
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

  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10
  },
  invoiceListContainer: {
    marginBottom: 25,
    elevation: 4,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 6,
    borderTopWidth: 1,
    borderColor: "rgba(0,0,0,0.1)"
  },
  name: {
    fontWeight: "bold",
    fontSize: 16
  },
  listItem: {
    fontSize: 16
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  message: {
    color: "tomato",
    fontSize: 17
  }
})