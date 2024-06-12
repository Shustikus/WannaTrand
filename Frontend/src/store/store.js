// store/store.js

import {createStore} from 'vuex';
import axios from 'axios';

const initialState = {
    isAuth: JSON.parse(localStorage.getItem('isAuth')) || false,
    firstname: '', // Добавляем поле firstname в состояние
    isLoading: false, // Добавляем поле isLoading в состояние
    isAuthError: false,
    exitModalOpen: false,
    deleteUserModalOpen: false,
    visibleSection: 'account',
    FileSizeErrorOpen: false,
    user: null,
};

const store = createStore({
    state: initialState,
    mutations: {
        setAuthStatus(state, status) {
            state.isAuth = status;
            // Update localStorage with the new value
            localStorage.setItem('isAuth', JSON.stringify(status));
        },
        setFirstname(state, firstname) {
            state.firstname = firstname; // Мутация для установки firstname
        },
        setIsLoading(state, isLoading) {
            state.isLoading = isLoading; // Мутация для установки isLoading
        },

        openAuthError(state) {
            state.isAuthError = true;
        },
        closeAuthError(state) {
            state.isAuthError = false;
        },

        openFileSizeError(state) {
            state.FileSizeErrorOpen = true;
        },
        closeFileSizeError(state) {
            state.FileSizeErrorOpen = false;
        },

        openExitModal(state) {
            state.exitModalOpen = true;
        },
        closeExitModal(state) {
            state.exitModalOpen = false;
        },

        openDeleteUserModal(state) {
            state.deleteUserModalOpen = true;
        },
        closeDeleteUserModal(state) {
            state.deleteUserModalOpen = false;
        },

        setVisibleSection(state, section) {
            state.visibleSection = section;
        },

        setUser(state, user) {
            state.user = user; // Мутация для установки user
        },
    },
    actions: {
        updateAuthStatus({commit}, status) {
            commit('setAuthStatus', status);
        },
        updateFirstname({commit}, firstname) {
            commit('setFirstname', firstname); // Действие для обновления firstname
        },
        updateIsLoading({commit}, isLoading) {
            commit('setIsLoading', isLoading); // Действие для обновления isLoading
        },
        async checkAuth({dispatch}) {
            dispatch('updateIsLoading', true); // Устанавливаем isLoading в true перед запросом
            await axios
                .get('http://localhost:5000/api/user/refresh', {withCredentials: true})
                .then((response) => {
                    console.log(response);
                    localStorage.setItem('accessToken', response.data.accessToken);
                })
                .catch((e) => {
                    console.log(e);
                })
                .finally(() => {
                    dispatch('updateIsLoading', false); // Устанавливаем isLoading в false после запроса
                });
        },
        loadUserFromLocalStorage({commit}) {
            const savedUserData = localStorage.getItem('userData');
            if (savedUserData) {
                const user = JSON.parse(savedUserData);
                commit('setUser', user); // Вызываем мутацию для установки пользователя в состояние
            }
        },

    },
});
export default store;