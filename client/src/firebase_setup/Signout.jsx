const signOut = async () => {
    try {
        await firebaseSignOut(auth);
        return true;
    } catch (error) { return false; }
};
