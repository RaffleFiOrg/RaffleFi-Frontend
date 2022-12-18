import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCross } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap'

export const SearchBar = (props) => {
    return (
        <form>
            <div className='searchForm'>
                <input className="searchBar" 
                onChange={(e) => props.setSearchTerm(e.target.value)}
                required name="searchTerm" type="search" placeholder='Search'/>
                <Button className="iconButton" type='reset'>
                    <FontAwesomeIcon icon={faCross} />
                </Button>
            </div>
        </form>
    )
}