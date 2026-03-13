package com.SplitSmart.GroupService.service;

import com.SplitSmart.GroupService.entity.Group;
import com.SplitSmart.GroupService.entity.GroupRole;
import com.SplitSmart.GroupService.repository.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupRepository groupRepository;
    private final GroupMemberService groupMemberService;

    @Transactional
    public Group createGroup(String groupName, UUID createdBy) {
        Group group = Group.builder()
                .groupName(groupName)
                .createdBy(createdBy)
                .build();

        Group savedGroup = groupRepository.save(group);

        // Creator automatically becomes ADVMIN
        groupMemberService.addMember(savedGroup.getGroupId(), createdBy, GroupRole.ADMIN);

        return savedGroup;
    }

    public Group getGroupById(UUID groupId) {
        return groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
    }

    @Transactional
    public Group updateGroupInfo(UUID groupId, String groupName) {
        Group group = getGroupById(groupId);
        group.setGroupName(groupName);
        return groupRepository.save(group);
    }
}
