import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  onSnapshot,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { uuidv4 } from "@firebase/util";
import { saveActivitieService } from "../Activities/ActivitiesServices";
import { concatString, upercasePrimaryLetter } from "../../helpers/Other";

export async function saveMemberService(member, user) {
  const uid = uuidv4();
  try {
    await setDoc(doc(db, "members", uid), member);
    await saveActivitieService({
      module: "Miembros",
      action: {
        name: "Registro de miembro",
        uid: uid,
      },
      description:
        "Registro de un nuevo miembro: " +
        upercasePrimaryLetter(
          concatString([
            member.lastName,
            member.motherLastName + ",",
            member.names,
          ])
        ),
      user: {
        names: user?.name,
        uid: user?.uid,
        photo: user?.photoUrl,
      },
    });

    return uid;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export function getMembersService(setData, conditions) {
  const q = query(
    collection(db, "members"),
    ...conditions,
    orderBy("created_at", "desc")
  );
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const members = [];
    querySnapshot.forEach((doc) => {
      members.push({
        ...doc.data(),
        uid: doc.id,
      });
    });
    setData(members);
  });

  return () => unsubscribe();
}

export function getMemberService(setData, uid) {
  const unsubscribe = onSnapshot(doc(db, "members", uid), (doc) => {
    setData({
      ...doc.data(),
      uid,
    });
  });

  return () => unsubscribe();
}

export async function getMemberByDni(dni) {
  const q = query(collection(db, "members"), where("dni", "==", dni));

  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return true;
  } else {
    return false;
  }
}

export function getMembersServiceSearsh(setData, conditions) {
  const q = query(collection(db, "members"), ...conditions);
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const members = [];
    querySnapshot.forEach((doc) => {
      members.push({
        ...doc.data(),
        uid: doc.id,
      });
    });
    setData(members);
  });

  return () => unsubscribe();
}

export async function updateMemberService(document, uid, user) {
  const memberRef = doc(db, "members", uid);
  try {
    await updateDoc(memberRef, document);
    await saveActivitieService({
      module: "Miembros",
      action: {
        name: "Actualizacion de miembro",
        uid: uid,
      },
      description:
        "Actualizacion de un miembro: " +
        upercasePrimaryLetter(
          concatString([
            document.lastName,
            document.motherLastName + ",",
            document.names,
          ])
        ),
      user: {
        names: user?.name,
        uid: user?.uid,
        photo: user?.photoUrl,
      },
    });

    return true;
  } catch (error) {
    return error;
  }
}
