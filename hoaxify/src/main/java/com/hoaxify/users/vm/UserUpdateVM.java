package com.hoaxify.users.vm;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.hoaxify.shared.ProfileImage;

import lombok.Data;

@Data
public class UserUpdateVM {
	
	@NotNull
	@Size(min = 4, max = 255)
	private String displayName; 
	
	@ProfileImage
	private String image; 
}
