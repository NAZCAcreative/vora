begin;
drop function public.my_chat_rooms(text,integer);
create function public.my_chat_rooms(p_role text,p_page integer default 1,p_query text default '',p_unread boolean default false) returns jsonb language plpgsql stable security definer set search_path='' as $$
declare result jsonb;
begin
  if auth.uid() is null or p_role not in ('student','teacher') then raise exception 'Login and valid role required' using errcode='42501'; end if;
  if length(coalesce(p_query,''))>100 then raise exception 'Search too long'; end if;
  select coalesce(jsonb_agg(to_jsonb(r)),'[]'::jsonb) into result from (
    select c.id,c.teacher_id as "teacherId",c.student_id as "studentId",p.id as "otherUserId",p.name as "otherUserName",p.avatar_url as "otherUserAvatar",c.last_message_at as "lastMessageAt",
      (select case when m.type='file' then '파일을 보냈습니다' else m.text end from public.chat_messages m where m.room_id=c.id order by m.created_at desc,m.id desc limit 1) as "lastMessagePreview",
      (select count(*) from public.chat_messages m where m.room_id=c.id and m.sender_id<>auth.uid() and m.read_at is null) as "unreadCount"
    from public.chat_rooms c join public.profiles p on p.id=case when p_role='teacher' then c.student_id else c.teacher_id end
    where ((p_role='teacher' and c.teacher_id=auth.uid()) or (p_role='student' and c.student_id=auth.uid()))
      and (not coalesce(p_unread,false) or exists(select 1 from public.chat_messages m where m.room_id=c.id and m.sender_id<>auth.uid() and m.read_at is null))
      and (coalesce(trim(p_query),'')='' or position(lower(trim(p_query)) in lower(p.name))>0 or exists(select 1 from public.chat_messages m where m.room_id=c.id and position(lower(trim(p_query)) in lower(coalesce(m.text,'')))>0))
    order by c.last_message_at desc nulls last,c.id desc limit 20 offset (greatest(1,least(coalesce(p_page,1),1000000))-1)*20
  ) r;
  return result;
end $$;
revoke all on function public.my_chat_rooms(text,integer,text,boolean) from public,anon;
grant execute on function public.my_chat_rooms(text,integer,text,boolean) to authenticated;
notify pgrst,'reload schema';
commit;
