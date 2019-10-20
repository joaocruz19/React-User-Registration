import React from 'react';
import './Nav.css';
import LinkComponent from './LinkComponent';


export default props =>
    <aside className="menu-area">
        <nav className="menu">
            {/* Refatorar fazendo com que os links sejam componentes... */}
            <LinkComponent destination="/" icon="home" label="Home"/>
            <LinkComponent destination="/users" icon="users" label="Users"/>
            {/* Feito xD... */}
        </nav>
    </aside>