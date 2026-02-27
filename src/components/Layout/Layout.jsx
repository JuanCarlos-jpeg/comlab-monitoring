import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <main style={{
                marginLeft: 'var(--sidebar-width)',
                flex: 1,
                padding: '2rem 3rem',
                backgroundColor: 'var(--bg-dark)',
                minHeight: '100vh'
            }}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
