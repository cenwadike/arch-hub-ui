import { useState } from 'react';
import { Sidebar, Menu, MenuItem,  } from 'react-pro-sidebar';


export default function NavBar() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <>
           <div style={{ display: 'flex', height: '100%', minHeight: '400px' }}>
                <Sidebar collapsed={collapsed} transitionDuration={1000}>
                    <Menu>
                    <MenuItem> Profile</MenuItem>
                    <MenuItem> Invoices</MenuItem>
                    <MenuItem> Status</MenuItem>
                    <MenuItem> Reviews</MenuItem>
                    </Menu>
                </Sidebar>
                <main style={{ padding: 10 }}>
                    <div>
                    <button className="sb-button" onClick={() => setCollapsed(!collapsed)}>
                        Collapse
                    </button>
                    </div>
                </main>
            </div>
        </>
    )
}