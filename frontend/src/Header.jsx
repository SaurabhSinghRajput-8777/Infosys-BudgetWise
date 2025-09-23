function Header(){
    return(
        <header>
            <nav className="Container">
            <nav className="Title">
            <h1>BudgetWise</h1>
            </nav>
            <nav className="HeaderComponents">
                <ul className="nav-menu">
                    <li><a href="#">Home</a></li>
                    <li><a href="#">Transactions</a></li>
                    <li><a href="#">Budget</a></li>
                    <li><a href="#">Profile</a></li>
                </ul>
            </nav>
            <hr></hr>
            </nav>
        </header>
    );
}
export default Header