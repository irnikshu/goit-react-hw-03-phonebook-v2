import { Component } from 'react';
import PropTypes from 'prop-types';
import Form from './Form/Form';
import ContactsList from './Contacts/Contacts';
import { nanoid } from 'nanoid';
import Filter from './Filter/Filter';

import styles from './app.module.scss';
import '../shared/Styles/styles.scss';

class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };
  componentDidMount() {
    const contacts = JSON.parse(localStorage.getItem('my-contacts'));
    if (contacts?.length) {
      //contacts && contacts.length)

      this.setState({ contacts });
    }
  }
  componentDidUpdate(prevState) {
    const { contacts } = this.state;
    // if (prevState.contacts.length !== contacts.length) {
    localStorage.setItem('my-contacts', JSON.stringify(contacts));
    // }
  }
  addContact = data => {
    const newContact = {
      id: nanoid(),
      name: data.name,
      number: data.number,
    };
    const checkName = newContact.name.toLowerCase();
    this.state.contacts.find(
      contact => contact.name.toLowerCase() === checkName
    )
      ? alert(data.name + ' is already in contacts')
      : this.setState(({ contacts }) => ({
          contacts: [newContact, ...contacts],
        }));
  };
  changeFilter = event => {
    this.setState({ filter: event.currentTarget.value });
  };
  getVisibleContact = () => {
    const { contacts, filter } = this.state;
    const normalizedFilter = filter.toLowerCase();

    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };
  deleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };
  render() {
    const { filter } = this.state;
    const visibleContact = this.getVisibleContact();
    const isBooks = Boolean(visibleContact.length);

    return (
      <div className={styles.wrapper}>
        <h2 className={styles.title}>Phonebook</h2>
        <Form onSubmit={this.addContact} />
        <h2 className={styles.title}>Contacts</h2>
        <Filter value={filter} changeFilter={this.changeFilter} />
        {isBooks && (
          <ContactsList
            contact={visibleContact}
            deleteContact={this.deleteContact}
          />
        )}
        {!isBooks && <p>No books in list</p>}
      </div>
    );
  }
}
export default App;
App.propTypes = {
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      number: PropTypes.string.isRequired,
    })
  ),
  filter: PropTypes.string,
  addContact: PropTypes.func,
  deleteContact: PropTypes.func,
  changeFilter: PropTypes.func,
  getVisibleContact: PropTypes.func,
};
