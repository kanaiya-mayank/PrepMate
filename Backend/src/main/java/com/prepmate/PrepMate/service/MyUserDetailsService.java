package com.prepmate.PrepMate.service;

import com.prepmate.PrepMate.dao.UserRepository;
import com.prepmate.PrepMate.model.User;
import com.prepmate.PrepMate.model.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;




@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = userRepository.findByUsername(username);

        if (user == null){
            System.out.println(username + " User not found");
            throw new UsernameNotFoundException(username + " User not found");
        }

        return new UserPrincipal(user);
    }
}
